# gene_analyzer.py
# Analyzes variants from VCF parser and determines
# diplotype and phenotype for each gene

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.variant_database import (
    VARIANT_DATABASE,
    get_phenotype_for_allele,
    get_star_from_rsid,
    get_activity_score
)


def analyze_gene(variants: list, gene: str) -> dict:
    """
    Main function — analyzes all variants for a specific gene.
    Input:  variants list from vcf_parser, gene name
    Output: { primary_gene, diplotype, phenotype, detected_variants }
    """
    # Filter variants for this gene only
    gene_variants = [v for v in variants 
                 if v.get("gene", "").upper() == gene.upper() 
                 and v.get("zygosity") != "reference"]
    if not gene_variants:
        return {
            "primary_gene": gene,
            "diplotype": "*1/*1",
            "phenotype": "NM",
            "detected_variants": [],
            "note": "No variants detected — assuming normal function"
        }

    # Build detected variants list
    detected = _build_detected_variants(gene_variants, gene)

    # Determine diplotype
    diplotype = _determine_diplotype(detected)

    # Determine phenotype from diplotype
    phenotype = _determine_phenotype(gene, detected)

    return {
        "primary_gene": gene,
        "diplotype": diplotype,
        "phenotype": phenotype,
        "detected_variants": detected
    }


def _build_detected_variants(gene_variants: list, gene: str) -> list:
    """Builds a clean list of detected variants with full annotation."""
    detected = []

    for v in gene_variants:
        star_allele = v.get("star_allele", "unknown")
        rsid = v.get("rsid", "unknown")

        # Try to get star allele from rsid if not in VCF
        if star_allele == "unknown" and rsid != "unknown":
            looked_up = get_star_from_rsid(gene, rsid)
            if looked_up:
                star_allele = looked_up

        # Get phenotype for this allele
        allele_phenotype = get_phenotype_for_allele(gene, star_allele)
        activity = get_activity_score(gene, star_allele)

        # Get clinical significance
        significance = _get_clinical_significance(gene, star_allele)

        detected.append({
            "rsid": rsid,
            "gene": gene,
            "star_allele": star_allele,
            "zygosity": v.get("zygosity", "unknown"),
            "allele_phenotype": allele_phenotype,
            "activity_score": activity,
            "clinical_significance": significance,
            "chrom": v.get("chrom", ""),
            "pos": v.get("pos", ""),
            "ref": v.get("ref", ""),
            "alt": v.get("alt", "")
        })

    return detected


def _determine_diplotype(detected_variants: list) -> str:
    """
    Determines diplotype string like *1/*4 from detected variants.
    """
    if not detected_variants:
        return "*1/*1"

    alleles = [v["star_allele"] for v in detected_variants if v["star_allele"] != "unknown"]

    if len(alleles) == 0:
        return "*1/*1"
    elif len(alleles) == 1:
        zygosity = detected_variants[0].get("zygosity", "unknown")
        if zygosity == "homozygous":
            return f"{alleles[0]}/{alleles[0]}"
        else:
            return f"*1/{alleles[0]}"
    else:
        return f"{alleles[0]}/{alleles[1]}"


def _determine_phenotype(gene: str, detected_variants: list) -> str:
    """
    Determines overall phenotype based on activity scores.
    Uses CPIC activity score method.
    """
    if not detected_variants:
        return "NM"

    # Calculate total activity score
    total_score = 0.0
    for v in detected_variants:
        score = v.get("activity_score", 1.0)
        zygosity = v.get("zygosity", "heterozygous")
        if zygosity == "homozygous":
            total_score += score * 2
        else:
            total_score += score + 1.0  # assume other allele is *1 (normal)

    # Normalize to diplotype score
    diplotype_score = total_score / 2 if len(detected_variants) > 1 else total_score

    # Map score to phenotype
    return _score_to_phenotype(gene, diplotype_score)


def _score_to_phenotype(gene: str, score: float) -> str:
    """Maps activity score to phenotype label."""
    if gene == "SLCO1B1":
        # SLCO1B1 uses different classification
        if score == 0.0:
            return "Poor Transport"
        elif score < 1.0:
            return "Decreased Transport"
        else:
            return "NM"

    # Standard metabolizer classification
    if score == 0.0:
        return "PM"   # Poor Metabolizer
    elif score < 1.0:
        return "IM"   # Intermediate Metabolizer
    elif score <= 2.0:
        return "NM"   # Normal Metabolizer
    elif score <= 3.0:
        return "RM"   # Rapid Metabolizer
    else:
        return "URM"  # Ultra-Rapid Metabolizer


def _get_clinical_significance(gene: str, star_allele: str) -> str:
    """Returns clinical significance string for a star allele."""
    gene_data = VARIANT_DATABASE.get(gene, {})
    allele_data = gene_data.get("alleles", {}).get(star_allele, {})
    return allele_data.get("function", "Unknown function")