# cpic_guidelines.py
# CPIC-aligned dosing recommendations for each drug/phenotype combination

CPIC_RECOMMENDATIONS = {
    "CODEINE": {
        "URM": {
            "action": "Avoid Use",
            "dose_adjustment": "Avoid codeine. Ultra-rapid metabolizers convert codeine to morphine too rapidly causing toxicity.",
            "alternative_drugs": ["tramadol", "morphine", "oxycodone"],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/"
        },
        "PM": {
            "action": "Avoid Use",
            "dose_adjustment": "Avoid codeine. Poor metabolizers cannot convert codeine to morphine — drug will be ineffective.",
            "alternative_drugs": ["morphine", "oxycodone", "hydromorphone"],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/"
        },
        "IM": {
            "action": "Reduce Dose",
            "dose_adjustment": "Use 25% lower starting dose. Monitor for reduced efficacy.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/"
        },
        "NM": {
            "action": "Standard Dose",
            "dose_adjustment": "Standard codeine dosing per product label.",
            "alternative_drugs": [],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/"
        },
        "RM": {
            "action": "Reduce Dose",
            "dose_adjustment": "Use with caution. Monitor for signs of opioid toxicity.",
            "alternative_drugs": ["tramadol"],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/"
        }
    },
    "WARFARIN": {
        "NM": {
            "action": "Standard Dose",
            "dose_adjustment": "Standard warfarin dosing. Monitor INR regularly.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-and-vkorc1/"
        },
        "IM": {
            "action": "Reduce Dose",
            "dose_adjustment": "Reduce warfarin dose by 25%. Monitor INR closely.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-and-vkorc1/"
        },
        "PM": {
            "action": "Reduce Dose",
            "dose_adjustment": "Reduce warfarin dose by 50%. Frequent INR monitoring required.",
            "alternative_drugs": ["apixaban", "rivaroxaban"],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-and-vkorc1/"
        }
    },
    "CLOPIDOGREL": {
        "NM": {
            "action": "Standard Dose",
            "dose_adjustment": "Standard clopidogrel 75mg daily.",
            "alternative_drugs": [],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19/"
        },
        "IM": {
            "action": "Adjust Dose",
            "dose_adjustment": "Consider alternative antiplatelet therapy. If clopidogrel used, monitor platelet function.",
            "alternative_drugs": ["prasugrel", "ticagrelor"],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19/"
        },
        "PM": {
            "action": "Avoid Use",
            "dose_adjustment": "Avoid clopidogrel. Use alternative antiplatelet agent.",
            "alternative_drugs": ["prasugrel", "ticagrelor"],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19/"
        },
        "RM": {
            "action": "Standard Dose",
            "dose_adjustment": "Standard clopidogrel dosing.",
            "alternative_drugs": [],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19/"
        },
        "URM": {
            "action": "Adjust Dose",
            "dose_adjustment": "Monitor for increased bleeding risk with standard dose.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19/"
        }
    },
    "SIMVASTATIN": {
        "NM": {
            "action": "Standard Dose",
            "dose_adjustment": "Standard simvastatin dosing up to 40mg daily.",
            "alternative_drugs": [],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/"
        },
        "Decreased Transport": {
            "action": "Reduce Dose",
            "dose_adjustment": "Limit simvastatin to 20mg daily. Monitor for muscle symptoms.",
            "alternative_drugs": ["rosuvastatin", "pravastatin"],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/"
        },
        "Poor Transport": {
            "action": "Avoid Use",
            "dose_adjustment": "Avoid simvastatin. High risk of myopathy and rhabdomyolysis.",
            "alternative_drugs": ["rosuvastatin", "pravastatin", "fluvastatin"],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/"
        }
    },
    "AZATHIOPRINE": {
        "NM": {
            "action": "Standard Dose",
            "dose_adjustment": "Standard azathioprine dosing.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-thiopurines-and-tpmt-and-nudt15/"
        },
        "IM": {
            "action": "Reduce Dose",
            "dose_adjustment": "Reduce dose to 30-70% of standard dose. Monitor blood counts.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-thiopurines-and-tpmt-and-nudt15/"
        },
        "PM": {
            "action": "Avoid Use",
            "dose_adjustment": "Avoid azathioprine. Extremely high risk of life-threatening toxicity.",
            "alternative_drugs": ["mycophenolate mofetil"],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-thiopurines-and-tpmt-and-nudt15/"
        }
    },
    "FLUOROURACIL": {
        "NM": {
            "action": "Standard Dose",
            "dose_adjustment": "Standard fluorouracil dosing per oncology protocol.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-fluoropyrimidines-and-dpyd/"
        },
        "IM": {
            "action": "Reduce Dose",
            "dose_adjustment": "Reduce starting dose by 50%. Titrate based on tolerance.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-fluoropyrimidines-and-dpyd/"
        },
        "PM": {
            "action": "Avoid Use",
            "dose_adjustment": "Avoid fluorouracil and capecitabine. Life-threatening toxicity risk.",
            "alternative_drugs": ["raltitrexed"],
            "monitoring_required": False,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/guideline-for-fluoropyrimidines-and-dpyd/"
        }
    }
}


def get_recommendation(drug: str, phenotype: str) -> dict:
    """
    Returns CPIC recommendation for a drug/phenotype combination.
    """
    drug = drug.upper().strip()
    drug_recs = CPIC_RECOMMENDATIONS.get(drug, {})
    rec = drug_recs.get(phenotype, None)

    if not rec:
        return {
            "action": "Consult Specialist",
            "dose_adjustment": "No specific guideline available. Consult clinical pharmacist.",
            "alternative_drugs": [],
            "monitoring_required": True,
            "cpic_guideline_url": "https://cpicpgx.org/guidelines/"
        }

    return rec