# drug_gene_map.py
# Maps each supported drug to its primary pharmacogenomic gene
# and stores all supported drug names for validation

DRUG_GENE_MAP = {
    "CODEINE":      "CYP2D6",
    "WARFARIN":     "CYP2C9",
    "CLOPIDOGREL":  "CYP2C19",
    "SIMVASTATIN":  "SLCO1B1",
    "AZATHIOPRINE": "TPMT",
    "FLUOROURACIL": "DPYD"
}

# All 6 supported genes
ALL_GENES = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"]

# All supported drug names
SUPPORTED_DRUGS = list(DRUG_GENE_MAP.keys())


def get_gene_for_drug(drug_name: str) -> str:
    """
    Returns the primary gene for a given drug name.
    Input is normalized to uppercase.
    Returns None if drug is not supported.
    """
    return DRUG_GENE_MAP.get(drug_name.upper().strip(), None)


def normalize_drug_input(drug_input: str) -> list:
    """
    Takes a comma-separated drug input string and returns
    a clean list of uppercase drug names.
    Example: "codeine, Warfarin" -> ["CODEINE", "WARFARIN"]
    """
    drugs = [d.strip().upper() for d in drug_input.split(",")]
    return [d for d in drugs if d]  # remove empty strings


def validate_drugs(drug_list: list) -> dict:
    """
    Validates a list of drug names.
    Returns:
        valid: list of supported drugs
        invalid: list of unsupported drugs
    """
    valid = []
    invalid = []
    for drug in drug_list:
        if drug.upper() in SUPPORTED_DRUGS:
            valid.append(drug.upper())
        else:
            invalid.append(drug)
    return {"valid": valid, "invalid": invalid}