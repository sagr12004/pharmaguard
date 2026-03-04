# variant_database.py
# Contains known pharmacogenomic variants for all 6 genes
# Maps star alleles to phenotypes and clinical significance

VARIANT_DATABASE = {
    "CYP2D6": {
        "alleles": {
            "*1":  {"phenotype": "NM",  "function": "Normal function",        "activity_score": 1.0},
            "*2":  {"phenotype": "NM",  "function": "Normal function",        "activity_score": 1.0},
            "*4":  {"phenotype": "PM",  "function": "No function",            "activity_score": 0.0},
            "*5":  {"phenotype": "PM",  "function": "No function (deletion)", "activity_score": 0.0},
            "*6":  {"phenotype": "PM",  "function": "No function",            "activity_score": 0.0},
            "*10": {"phenotype": "IM",  "function": "Reduced function",       "activity_score": 0.25},
            "*17": {"phenotype": "IM",  "function": "Reduced function",       "activity_score": 0.5},
            "*41": {"phenotype": "IM",  "function": "Reduced function",       "activity_score": 0.5},
            "*1x2":{"phenotype": "URM", "function": "Increased function",     "activity_score": 2.0},
            "*2x2":{"phenotype": "URM", "function": "Increased function",     "activity_score": 2.0},
        },
        "rsid_to_star": {
            "rs3892097":  "*4",
            "rs5030655":  "*6",
            "rs1065852":  "*10",
            "rs28371706": "*41",
            "rs16947":    "*2",
        }
    },

    "CYP2C19": {
        "alleles": {
            "*1":  {"phenotype": "NM",  "function": "Normal function",   "activity_score": 1.0},
            "*2":  {"phenotype": "PM",  "function": "No function",       "activity_score": 0.0},
            "*3":  {"phenotype": "PM",  "function": "No function",       "activity_score": 0.0},
            "*17": {"phenotype": "URM", "function": "Increased function","activity_score": 1.5},
        },
        "rsid_to_star": {
            "rs4244285":  "*2",
            "rs4986893":  "*3",
            "rs12248560": "*17",
        }
    },

    "CYP2C9": {
        "alleles": {
            "*1":  {"phenotype": "NM", "function": "Normal function",   "activity_score": 1.0},
            "*2":  {"phenotype": "IM", "function": "Reduced function",  "activity_score": 0.5},
            "*3":  {"phenotype": "PM", "function": "No function",       "activity_score": 0.0},
            "*5":  {"phenotype": "PM", "function": "No function",       "activity_score": 0.0},
            "*6":  {"phenotype": "PM", "function": "No function",       "activity_score": 0.0},
        },
        "rsid_to_star": {
            "rs1799853": "*2",
            "rs1057910": "*3",
            "rs28371686":"*5",
        }
    },

    "SLCO1B1": {
        "alleles": {
            "*1a": {"phenotype": "NM",           "function": "Normal transport",   "activity_score": 1.0},
            "*1b": {"phenotype": "NM",           "function": "Normal transport",   "activity_score": 1.0},
            "*5":  {"phenotype": "Poor Transport","function": "Decreased transport","activity_score": 0.0},
            "*15": {"phenotype": "Poor Transport","function": "Decreased transport","activity_score": 0.0},
            "*17": {"phenotype": "Poor Transport","function": "Decreased transport","activity_score": 0.0},
        },
        "rsid_to_star": {
            "rs4149056": "*5",
            "rs2306283": "*1b",
            "rs11045819":"*15",
        }
    },

    "TPMT": {
        "alleles": {
            "*1":  {"phenotype": "NM", "function": "Normal function",  "activity_score": 1.0},
            "*2":  {"phenotype": "PM", "function": "No function",      "activity_score": 0.0},
            "*3A": {"phenotype": "PM", "function": "No function",      "activity_score": 0.0},
            "*3B": {"phenotype": "IM", "function": "Reduced function", "activity_score": 0.5},
            "*3C": {"phenotype": "IM", "function": "Reduced function", "activity_score": 0.5},
        },
        "rsid_to_star": {
            "rs1800462": "*2",
            "rs1800460": "*3B",
            "rs1142345": "*3C",
            "rs1800584": "*3A",
        }
    },

    "DPYD": {
        "alleles": {
            "*1":  {"phenotype": "NM", "function": "Normal function",  "activity_score": 1.0},
            "*2A": {"phenotype": "PM", "function": "No function",      "activity_score": 0.0},
            "*13": {"phenotype": "PM", "function": "No function",      "activity_score": 0.0},
        },
        "rsid_to_star": {
            "rs3918290":  "*2A",
            "rs55886062": "*13",
            "rs67376798": "HapB3",
        }
    }
}


def get_phenotype_for_allele(gene: str, star_allele: str) -> str:
    """Returns phenotype string for a given gene and star allele."""
    gene_data = VARIANT_DATABASE.get(gene, {})
    allele_data = gene_data.get("alleles", {}).get(star_allele, {})
    return allele_data.get("phenotype", "Unknown")


def get_star_from_rsid(gene: str, rsid: str) -> str:
    """Returns star allele for a given rsID."""
    gene_data = VARIANT_DATABASE.get(gene, {})
    return gene_data.get("rsid_to_star", {}).get(rsid, None)


def get_activity_score(gene: str, star_allele: str) -> float:
    """Returns activity score for a given gene and star allele."""
    gene_data = VARIANT_DATABASE.get(gene, {})
    allele_data = gene_data.get("alleles", {}).get(star_allele, {})
    return allele_data.get("activity_score", 1.0)