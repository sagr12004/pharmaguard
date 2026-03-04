# vcf_parser.py - FIXED for hackathon VCF format
import re


def parse_vcf(file_bytes: bytes, filename: str = "unknown.vcf") -> dict:
    try:
        content = file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        return {"success": False, "error": "File encoding error. Must be UTF-8."}

    lines = content.strip().split("\n")

    if not lines[0].startswith("##fileformat=VCF"):
        return {"success": False, "error": "Invalid VCF file. Must start with ##fileformat=VCF"}

    patient_id = "PATIENT_UNKNOWN"
    variants = []
    header_cols = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Extract patient ID from #CHROM header line (last column)
        if line.startswith("#CHROM"):
            header_cols = line.lstrip("#").split("\t")
            # Patient ID is the LAST column in header
            if len(header_cols) > 9:
                patient_id = header_cols[-1].strip()
            continue

        # Extract patient ID from ##SAMPLE tag if present
        if line.startswith("##SAMPLE"):
            match = re.search(r'ID=([^,>]+)', line)
            if match:
                patient_id = match.group(1)
            continue

        # Skip other meta lines
        if line.startswith("#"):
            continue

        # Parse data rows
        if header_cols:
            variant = _parse_variant_line(line, header_cols)
            if variant:
                variants.append(variant)

    return {
        "success": True,
        "patient_id": patient_id,
        "variants": variants,
        "total_variants": len(variants)
    }


def _parse_variant_line(line: str, header_cols: list) -> dict:
    cols = line.split("\t")
    if len(cols) < 8:
        return None

    row = {}
    for i, col_name in enumerate(header_cols):
        if i < len(cols):
            row[col_name] = cols[i]

    info = _parse_info_field(row.get("INFO", ""))

    gene = info.get("GENE", None)
    star = info.get("STAR", None)
    rsid = info.get("RS", row.get("ID", None))

    if not gene:
        return None

    # Determine zygosity from GT field
    zygosity = _determine_zygosity(row, header_cols)

    # Only include variants that are NOT 0/0 (reference homozygous = no variant)
    # BUT still include them for completeness — risk engine will handle it
    return {
        "rsid":          rsid or "unknown",
        "gene":          gene,
        "star_allele":   star or "unknown",
        "chrom":         row.get("CHROM", ""),
        "pos":           row.get("POS", ""),
        "ref":           row.get("REF", ""),
        "alt":           row.get("ALT", ""),
        "filter":        row.get("FILTER", ""),
        "zygosity":      zygosity,
        "is_variant":    zygosity != "reference",  # True if actual variant
        "func":          info.get("FUNC", ""),
        "cpic_level":    info.get("CPIC", ""),
        "clnsig":        info.get("CLNSIG", "")
    }


def _parse_info_field(info_str: str) -> dict:
    info = {}
    for item in info_str.split(";"):
        if "=" in item:
            key, value = item.split("=", 1)
            info[key.strip()] = value.strip()
    return info


def _determine_zygosity(row: dict, header_cols: list) -> str:
    sample_cols = [c for c in header_cols if c not in
                   ["CHROM","POS","ID","REF","ALT","QUAL","FILTER","INFO","FORMAT"]]

    if not sample_cols:
        return "unknown"

    format_col = row.get("FORMAT", "")
    sample_data = row.get(sample_cols[0], "")

    if not format_col or not sample_data:
        return "unknown"

    fields = format_col.split(":")
    values = sample_data.split(":")

    if "GT" in fields:
        gt_index = fields.index("GT")
        if gt_index < len(values):
            gt = values[gt_index]
            alleles = re.split(r'[/|]', gt)
            if len(alleles) == 2:
                if alleles[0] == "0" and alleles[1] == "0":
                    return "reference"       # 0/0 = no variant
                elif alleles[0] == alleles[1]:
                    return "homozygous"      # 1/1 = homozygous variant
                else:
                    return "heterozygous"    # 0/1 = heterozygous variant

    return "unknown"


def validate_vcf_file(file_bytes: bytes, file_size: int) -> dict:
    if file_size > 5 * 1024 * 1024:
        return {"valid": False, "error": "File too large. Maximum size is 5MB."}

    try:
        content = file_bytes.decode("utf-8")
    except Exception:
        return {"valid": False, "error": "Cannot read file. Ensure it is a valid UTF-8 text file."}

    lines = content.strip().split("\n")

    if not lines:
        return {"valid": False, "error": "File is empty."}

    if not lines[0].startswith("##fileformat=VCF"):
        return {"valid": False, "error": "Not a valid VCF file. Missing ##fileformat header."}

    has_chrom_header = any(l.startswith("#CHROM") for l in lines)
    if not has_chrom_header:
        return {"valid": False, "error": "Invalid VCF structure. Missing #CHROM header line."}

    return {"valid": True, "error": None}