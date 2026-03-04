# risk_engine.py
# Predicts drug-specific risk based on gene phenotype
# Risk labels: Safe | Adjust Dosage | Toxic | Ineffective | Unknown

RISK_MATRIX = {
    "CODEINE": {
        "gene": "CYP2D6",
        "phenotype_risk": {
            "URM": {"risk_label": "Toxic",         "severity": "critical", "confidence": 0.95},
            "RM":  {"risk_label": "Adjust Dosage", "severity": "moderate", "confidence": 0.80},
            "NM":  {"risk_label": "Safe",          "severity": "none",     "confidence": 0.95},
            "IM":  {"risk_label": "Adjust Dosage", "severity": "low",      "confidence": 0.85},
            "PM":  {"risk_label": "Ineffective",   "severity": "moderate", "confidence": 0.95},
        }
    },
    "WARFARIN": {
        "gene": "CYP2C9",
        "phenotype_risk": {
            "NM":  {"risk_label": "Safe",          "severity": "none",     "confidence": 0.90},
            "IM":  {"risk_label": "Adjust Dosage", "severity": "moderate", "confidence": 0.90},
            "PM":  {"risk_label": "Adjust Dosage", "severity": "high",     "confidence": 0.95},
        }
    },
    "CLOPIDOGREL": {
        "gene": "CYP2C19",
        "phenotype_risk": {
            "URM": {"risk_label": "Adjust Dosage", "severity": "low",      "confidence": 0.80},
            "RM":  {"risk_label": "Safe",          "severity": "none",     "confidence": 0.90},
            "NM":  {"risk_label": "Safe",          "severity": "none",     "confidence": 0.95},
            "IM":  {"risk_label": "Adjust Dosage", "severity": "moderate", "confidence": 0.85},
            "PM":  {"risk_label": "Ineffective",   "severity": "high",     "confidence": 0.95},
        }
    },
    "SIMVASTATIN": {
        "gene": "SLCO1B1",
        "phenotype_risk": {
            "NM":              {"risk_label": "Safe",          "severity": "none",     "confidence": 0.90},
            "Decreased Transport": {"risk_label": "Adjust Dosage", "severity": "moderate", "confidence": 0.85},
            "Poor Transport":  {"risk_label": "Toxic",         "severity": "high",     "confidence": 0.95},
        }
    },
    "AZATHIOPRINE": {
        "gene": "TPMT",
        "phenotype_risk": {
            "NM":  {"risk_label": "Safe",          "severity": "none",     "confidence": 0.95},
            "IM":  {"risk_label": "Adjust Dosage", "severity": "moderate", "confidence": 0.90},
            "PM":  {"risk_label": "Toxic",         "severity": "critical", "confidence": 0.95},
        }
    },
    "FLUOROURACIL": {
        "gene": "DPYD",
        "phenotype_risk": {
            "NM":  {"risk_label": "Safe",          "severity": "none",     "confidence": 0.95},
            "IM":  {"risk_label": "Adjust Dosage", "severity": "moderate", "confidence": 0.90},
            "PM":  {"risk_label": "Toxic",         "severity": "critical", "confidence": 0.95},
        }
    }
}


def predict_risk(drug: str, phenotype: str) -> dict:
    """
    Predicts risk for a drug given a phenotype.
    Input:  drug name (uppercase), phenotype string
    Output: { risk_label, confidence_score, severity }
    """
    drug = drug.upper().strip()

    if drug not in RISK_MATRIX:
        return {
            "risk_label": "Unknown",
            "confidence_score": 0.0,
            "severity": "none"
        }

    drug_matrix = RISK_MATRIX[drug]["phenotype_risk"]
    risk_data = drug_matrix.get(phenotype, None)

    if not risk_data:
        return {
            "risk_label": "Unknown",
            "confidence_score": 0.5,
            "severity": "none"
        }

    return {
        "risk_label": risk_data["risk_label"],
        "confidence_score": risk_data["confidence"],
        "severity": risk_data["severity"]
    }


def get_primary_gene_for_drug(drug: str) -> str:
    """Returns the primary gene associated with a drug."""
    drug = drug.upper().strip()
    return RISK_MATRIX.get(drug, {}).get("gene", "Unknown")