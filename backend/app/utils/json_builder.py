# json_builder.py
# Assembles the final JSON output matching exact hackathon schema

from datetime import datetime, timezone


def build_output_json(
    patient_id: str,
    drug: str,
    risk_assessment: dict,
    pharmacogenomic_profile: dict,
    clinical_recommendation: dict,
    llm_explanation: dict,
    quality_metrics: dict
) -> dict:
    """
    Assembles all analysis results into the exact required JSON schema.
    """

    return {
        "patient_id": patient_id,
        "drug": drug.upper(),
        "timestamp": datetime.now(timezone.utc).isoformat(),

        "risk_assessment": {
            "risk_label": risk_assessment.get("risk_label", "Unknown"),
            "confidence_score": round(risk_assessment.get("confidence_score", 0.0), 2),
            "severity": risk_assessment.get("severity", "none")
        },

        "pharmacogenomic_profile": {
            "primary_gene": pharmacogenomic_profile.get("primary_gene", "Unknown"),
            "diplotype": pharmacogenomic_profile.get("diplotype", "*1/*1"),
            "phenotype": pharmacogenomic_profile.get("phenotype", "Unknown"),
            "detected_variants": pharmacogenomic_profile.get("detected_variants", [])
        },

        "clinical_recommendation": {
            "action": clinical_recommendation.get("action", "Consult Specialist"),
            "dose_adjustment": clinical_recommendation.get("dose_adjustment", ""),
            "alternative_drugs": clinical_recommendation.get("alternative_drugs", []),
            "monitoring_required": clinical_recommendation.get("monitoring_required", True),
            "cpic_guideline_url": clinical_recommendation.get("cpic_guideline_url", "https://cpicpgx.org")
        },

        "llm_generated_explanation": {
            "summary": llm_explanation.get("summary", ""),
            "mechanism": llm_explanation.get("mechanism", ""),
            "variant_impact": llm_explanation.get("variant_impact", ""),
            "clinical_context": llm_explanation.get("clinical_context", "")
        },

        "quality_metrics": {
            "vcf_parsing_success": quality_metrics.get("vcf_parsing_success", False),
            "variants_detected": quality_metrics.get("variants_detected", 0),
            "genes_analyzed": quality_metrics.get("genes_analyzed", 6),
            "annotation_completeness": quality_metrics.get("annotation_completeness", 0.0),
            "analysis_version": "1.0.0"
        }
    }


def calculate_quality_metrics(parse_result: dict, gene_profile: dict) -> dict:
    """
    Calculates quality metrics from parsing and analysis results.
    """
    variants = parse_result.get("variants", [])
    detected = gene_profile.get("detected_variants", [])

    # Calculate annotation completeness
    if not variants:
        completeness = 0.0
    else:
        annotated = sum(
            1 for v in variants
            if v.get("gene") and v.get("star_allele") != "unknown"
        )
        completeness = round(annotated / len(variants), 2)

    return {
        "vcf_parsing_success": parse_result.get("success", False),
        "variants_detected": len(detected),
        "genes_analyzed": 6,
        "annotation_completeness": completeness
    }