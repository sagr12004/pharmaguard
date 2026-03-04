# analyze.py
# FastAPI route — POST /analyze
# Orchestrates all logic and returns final JSON

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from logic.vcf_parser import parse_vcf, validate_vcf_file
from logic.gene_analyzer import analyze_gene
from logic.risk_engine import predict_risk
from logic.cpic_guidelines import get_recommendation
from services.claude_service import generate_explanation
from utils.json_builder import build_output_json, calculate_quality_metrics
from data.drug_gene_map import get_gene_for_drug, normalize_drug_input, validate_drugs

router = APIRouter()


@router.post("/analyze")
async def analyze(
    vcf_file: UploadFile = File(...),
    drug_names: str = Form(...)
):
    """
    Main analysis endpoint.
    Accepts VCF file + drug names, returns pharmacogenomic risk JSON.
    """

    # Read file
    file_bytes = await vcf_file.read()
    file_size = len(file_bytes)

    # Validate VCF
    validation = validate_vcf_file(file_bytes, file_size)
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["error"])

    # Parse VCF
    parse_result = parse_vcf(file_bytes, vcf_file.filename)
    if not parse_result["success"]:
        raise HTTPException(status_code=400, detail=parse_result["error"])

    # Validate and normalize drugs
    drug_list = normalize_drug_input(drug_names)
    drug_validation = validate_drugs(drug_list)

    if not drug_validation["valid"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported drugs: {drug_validation['invalid']}. Supported: CODEINE, WARFARIN, CLOPIDOGREL, SIMVASTATIN, AZATHIOPRINE, FLUOROURACIL"
        )

    results = []

    # Process each drug
    for drug in drug_validation["valid"]:

        # Get gene for this drug
        gene = get_gene_for_drug(drug)

        # Analyze gene variants
        gene_profile = analyze_gene(parse_result["variants"], gene)

        # Predict risk
        risk = predict_risk(drug, gene_profile["phenotype"])

        # Get CPIC recommendation
        recommendation = get_recommendation(drug, gene_profile["phenotype"])

        # Generate LLM explanation
        explanation = generate_explanation(
            gene=gene,
            diplotype=gene_profile["diplotype"],
            phenotype=gene_profile["phenotype"],
            drug=drug,
            risk_label=risk["risk_label"],
            detected_variants=gene_profile["detected_variants"]
        )

        # Calculate quality metrics
        quality = calculate_quality_metrics(parse_result, gene_profile)

        # Build final JSON
        output = build_output_json(
            patient_id=parse_result["patient_id"],
            drug=drug,
            risk_assessment=risk,
            pharmacogenomic_profile=gene_profile,
            clinical_recommendation=recommendation,
            llm_explanation=explanation,
            quality_metrics=quality
        )

        results.append(output)

    # Return single result or list
    if len(results) == 1:
        return JSONResponse(content=results[0])
    else:
        return JSONResponse(content={"results": results})


@router.get("/drugs")
async def get_supported_drugs():
    """Returns list of supported drugs."""
    return {
        "supported_drugs": [
            "CODEINE", "WARFARIN", "CLOPIDOGREL",
            "SIMVASTATIN", "AZATHIOPRINE", "FLUOROURACIL"
        ]
    }


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "version": "1.0.0"}