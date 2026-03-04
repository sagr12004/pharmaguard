# claude_service.py
# Uses Groq API (free) for clinical explanations

import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_explanation(
    gene: str,
    diplotype: str,
    phenotype: str,
    drug: str,
    risk_label: str,
    detected_variants: list
) -> dict:
    """
    Calls Groq API to generate a clinical explanation.
    Returns structured explanation dict.
    """

    # Build variant summary
    variant_summary = ""
    for v in detected_variants:
        variant_summary += f"- {v.get('rsid', 'unknown')} | {v.get('star_allele', 'unknown')} | {v.get('clinical_significance', 'unknown')}\n"

    if not variant_summary:
        variant_summary = "No specific variants detected — assuming reference alleles"

    prompt = f"""You are a clinical pharmacogenomics expert. Generate a structured clinical explanation for the following patient case.

PATIENT DATA:
- Drug: {drug}
- Primary Gene: {gene}
- Diplotype: {diplotype}
- Phenotype: {phenotype}
- Risk Assessment: {risk_label}
- Detected Variants:
{variant_summary}

Generate a JSON response with EXACTLY these 4 fields:
{{
  "summary": "2-3 sentence plain English summary of the risk for this patient",
  "mechanism": "Explanation of how {gene} normally processes {drug} biologically",
  "variant_impact": "Specific impact of the detected variants on drug metabolism",
  "clinical_context": "What this means practically for the prescribing doctor"
}}

Rules:
- Be specific, cite the actual variants and gene names
- Use medical terminology but keep it understandable
- Keep each field to 2-4 sentences
- Return ONLY the JSON, no extra text, no markdown
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a clinical pharmacogenomics expert. Always respond with valid JSON only, no extra text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=1000
        )

        response_text = response.choices[0].message.content

        # Clean and parse JSON
        cleaned = re.sub(r'```json|```', '', response_text).strip()
        explanation = json.loads(cleaned)

        return {
            "summary":          explanation.get("summary", ""),
            "mechanism":        explanation.get("mechanism", ""),
            "variant_impact":   explanation.get("variant_impact", ""),
            "clinical_context": explanation.get("clinical_context", "")
        }

    except Exception as e:
        return {
            "summary":          f"Clinical explanation unavailable: {str(e)}",
            "mechanism":        f"{gene} is responsible for metabolizing {drug}.",
            "variant_impact":   f"Detected diplotype {diplotype} results in {phenotype} phenotype.",
            "clinical_context": f"Risk assessment: {risk_label}. Consult clinical pharmacist."
        }