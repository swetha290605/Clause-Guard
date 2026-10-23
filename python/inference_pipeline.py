"""
Clause Guard - Production Python Inference & Redlining Engine
Standalone module for automated contract risk scanning, span extraction, and redline synthesis.
"""

import re
from typing import List, Dict, Any, Optional

RISK_METADATA = {
    "INDEMNITY": {
        "title": "Uncapped Indemnification",
        "category_group": "Liabilities & Indemnity",
        "cuad_ref": "CUAD #37 (Indemnification)",
        "base_severity": "CRITICAL"
    },
    "LIABILITY_CAP": {
        "title": "Asymmetric Liability Cap",
        "category_group": "Liabilities & Indemnity",
        "cuad_ref": "CUAD #19 (Cap on Liability)",
        "base_severity": "CRITICAL"
    },
    "PAYMENT": {
        "title": "Non-Refundable Retainer & Acceleration",
        "category_group": "Payment & Fees",
        "cuad_ref": "CUAD #34 (Price Restrictions)",
        "base_severity": "HIGH"
    },
    "TERMINATION": {
        "title": "Auto-Renewal & Notice Trap",
        "category_group": "Termination & Auto-Renewal",
        "cuad_ref": "CUAD #7 (Notice to Terminate Renewal)",
        "base_severity": "HIGH"
    },
    "DATA_PRIVACY": {
        "title": "Delayed Breach Notification (>72h)",
        "category_group": "Data Privacy & Security",
        "cuad_ref": "CUAD #17 (Audit Rights)",
        "base_severity": "HIGH"
    },
    "IP_RIGHTS": {
        "title": "Deliverables & Data Exploitation",
        "category_group": "Intellectual Property & Ownership",
        "cuad_ref": "CUAD #8 (Ownership of IP)",
        "base_severity": "CRITICAL"
    },
    "WARRANTIES": {
        "title": "As-Is Disclaimer & Remedy Exclusion",
        "category_group": "Warranties & Disclaimers",
        "cuad_ref": "CUAD #21 (Warranty Duration)",
        "base_severity": "MEDIUM"
    },
    "UNILATERAL_CHANGE": {
        "title": "Mid-Term Unilateral Modification",
        "category_group": "Unilateral Modifications",
        "cuad_ref": "CUAD #31 (Change of Control)",
        "base_severity": "HIGH"
    },
    "GOVERNING_LAW": {
        "title": "Exclusive Foreign Venue & Jury Waiver",
        "category_group": "Governing Law & Disputes",
        "cuad_ref": "CUAD #40 (Governing Law)",
        "base_severity": "MEDIUM"
    }
}

RULE_PATTERNS = [
    {
        "category": "INDEMNITY",
        "triggers": [
            r"defend,\s*indemnify\s*and\s*hold\s*harmless",
            r"any\s*and\s*all\s*claims,\s*damages,\s*liabilities",
            r"uncapped\s*indemnit|solely\s*defend\s*vendor"
        ],
        "spans": [
            (r"Customer\s+shall\s+defend,\s*indemnify\s*and\s*hold\s*harmless\s*Vendor[^.,;]*", 0.96),
            (r"any\s+and\s+all\s+claims,\s*damages,\s*liabilities,\s*costs,\s*and\s*expenses", 0.94)
        ],
        "rationale": "One-sided unilateral customer indemnification shifts uncapped financial exposure onto customer.",
        "redline_replace": lambda t: re.sub(
            r"Customer\s+shall\s+defend,\s*indemnify\s*and\s*hold\s*harmless\s*Vendor,\s*its\s*affiliates[^\.]*\.",
            "Each party shall mutually defend, indemnify, and hold harmless the other party against third-party claims arising solely from gross negligence, willful misconduct, or direct infringement.",
            t, flags=re.IGNORECASE
        )
    },
    {
        "category": "LIABILITY_CAP",
        "triggers": [
            r"limitation\s+of\s+liability|aggregate\s+liability",
            r"exceed\s+the\s+total\s+fees\s+paid.*(one|1)\s+month",
            r"disclaims\s+all\s+liability\s+for\s+consequential"
        ],
        "spans": [
            (r"exceed\s+the\s+total\s+fees\s+paid\s+by\s+Customer\s+in\s+the\s+one\s*\(1\)\s*month[^.,;]*", 0.98),
            (r"or\s+\$100,\s*whichever\s+is\s+less", 0.97)
        ],
        "rationale": "Severe 1-month or $100 liability cap renders customer unable to recover damages in data breaches.",
        "redline_replace": lambda t: re.sub(
            r"exceed\s+the\s+total\s+fees\s+paid\s+by\s+Customer\s+in\s+the\s+one\s*\(1\)\s*month\s+preceding[^\.]*\.",
            "exceed the total fees paid or payable by Customer under this Agreement in the twelve (12) months preceding the incident, with uncapped carve-outs for confidentiality and data breach obligations.",
            t, flags=re.IGNORECASE
        )
    },
    {
        "category": "PAYMENT",
        "triggers": [
            r"strictly\s+non-refundable|upfront\s+retainer",
            r"remaining\s+milestones\s+shall\s+accelerate",
            r"immediately\s+due\s+and\s+payable"
        ],
        "spans": [
            (r"All\s+fees\s+paid\s+are\s+strictly\s+non-refundable\s+under\s+any\s+circumstances", 0.95),
            (r"all\s+remaining\s+milestones\s+shall\s+accelerate\s+and\s+become\s+immediately\s+due", 0.94)
        ],
        "rationale": "Strictly non-refundable fees deny customer pro-rata recovery upon early termination for vendor cause.",
        "redline_replace": lambda t: re.sub(
            r"All\s+fees\s+paid\s+are\s+strictly\s+non-refundable\s+under\s+any\s+circumstances[^\.]*\.",
            "Fees paid for uncompleted milestones or degraded services shall be promptly refunded on a pro-rata basis upon termination.",
            t, flags=re.IGNORECASE
        )
    },
    {
        "category": "TERMINATION",
        "triggers": [
            r"automatically\s+renew|renewal\s+periods|written\s+notice\s+of\s+non-renewal",
            r"at\s+least\s+ninety\s*\(90\)\s*days\s+prior"
        ],
        "spans": [
            (r"automatically\s+renew\s+for\s+successive\s+one-year\s+periods", 0.93),
            (r"at\s+least\s+ninety\s*\(90\)\s*days\s+prior\s+to\s+the\s+expiration", 0.96)
        ],
        "rationale": "A 90-day advance notice requirement creates high risk of unwanted evergreen contract renewal.",
        "redline_replace": lambda t: re.sub(
            r"at\s+least\s+ninety\s*\(90\)\s*days\s+prior\s+to\s+the\s+expiration",
            "at least thirty (30) days prior to the expiration, provided Vendor sends written renewal reminder at least sixty (60) days prior",
            t, flags=re.IGNORECASE
        )
    },
    {
        "category": "IP_RIGHTS",
        "triggers": [
            r"Vendor\s+shall\s+own\s+all\s+right|irrevocable,\s*perpetual,\s*royalty-free",
            r"license\s+to\s+use\s+Customer\s+Data.*(machine\s+learning|ai)"
        ],
        "spans": [
            (r"grants\s+Vendor\s+an\s+irrevocable,\s*perpetual,\s*royalty-free,\s*worldwide\s+license\s+to\s+use\s+Customer\s+Data", 0.97)
        ],
        "rationale": "Perpetual license to train vendor AI models on customer data compromises trade secrets and IP.",
        "redline_replace": lambda t: re.sub(
            r"grants\s+Vendor\s+an\s+irrevocable,\s*perpetual[^\.]*algorithms\.",
            "Customer retains all right, title, and interest in and to Customer Data. Vendor shall not use Customer Data to train machine learning models without express written consent.",
            t, flags=re.IGNORECASE
        )
    },
    {
        "category": "UNILATERAL_CHANGE",
        "triggers": [
            r"modify\s+these\s+terms.*sole\s+and\s+absolute\s+discretion",
            r"effective\s+immediately\s+upon\s+posting"
        ],
        "spans": [
            (r"reserves\s+the\s+right\s+to\s+modify\s+these\s+terms[^\.]*sole\s+and\s+absolute\s+discretion", 0.96),
            (r"effective\s+immediately\s+upon\s+posting", 0.92)
        ],
        "rationale": "Mid-term unilateral modification power allows vendor to alter pricing or service levels without consent.",
        "redline_replace": lambda t: re.sub(
            r"Vendor\s+reserves\s+the\s+right\s+to\s+modify\s+these\s+terms[^\.]*\.",
            "No amendment or modification of this Agreement shall be binding unless executed in writing by authorized representatives of both parties.",
            t, flags=re.IGNORECASE
        )
    }
]


class ClauseGuardScanner:
    """
    Main Python Inference Pipeline for Clause Guard
    """
    def __init__(self):
        self.rules = RULE_PATTERNS

    def segment_contract(self, text: str) -> List[Dict[str, Any]]:
        """Segments raw text into structured clauses/paragraphs."""
        paragraphs = [p.strip() for p in re.split(r'\n\s*\n+', text) if len(p.strip()) > 25]
        clauses = []
        for idx, p in enumerate(paragraphs):
            title_match = re.search(r'^(?:(?:Section|Article|Clause)\s*[\d\.\w]+[:\-\s]+)?([A-Z][A-Za-z\s,\/&]{3,40})(?:\:|\.|\—|\n)', p)
            title = title_match.group(1).strip() if title_match else f"Clause {idx + 1}"
            if len(title) > 35:
                title = f"Clause {idx + 1}"
            clauses.append({
                "id": f"clause-{idx + 1}",
                "number": idx + 1,
                "title": title,
                "text": p,
                "original_text": p
            })
        return clauses

    def analyze_clause(self, clause: Dict[str, Any]) -> Dict[str, Any]:
        """Runs multi-label risk detection, span extraction, and redline recommendation."""
        text = clause["text"]
        matched_labels = []
        highest_severity = "SAFE"
        severity_score = 0
        suggested_redline = text
        rationale = "Standard contractual clause."

        for rule in self.rules:
            matched = any(re.search(pat, text, re.IGNORECASE) for pat in rule["triggers"])
            if matched:
                category = rule["category"]
                meta = RISK_METADATA.get(category, {})
                severity = meta.get("base_severity", "MEDIUM")

                # Track highest severity
                current_score = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}.get(severity, 0)
                if current_score > severity_score:
                    severity_score = current_score
                    highest_severity = severity

                # Extract trigger spans
                spans = []
                for span_pat, weight in rule["spans"]:
                    for m in re.finditer(span_pat, text, re.IGNORECASE):
                        spans.append({
                            "span_text": m.group(0),
                            "start": m.start(),
                            "end": m.end(),
                            "saliency_weight": weight
                        })

                matched_labels.append({
                    "category": category,
                    "title": meta.get("title", category),
                    "cuad_ref": meta.get("cuad_ref", ""),
                    "severity": severity,
                    "spans": spans
                })

                if suggested_redline == text:
                    suggested_redline = rule["redline_replace"](text)
                    rationale = rule["rationale"]

        return {
            **clause,
            "severity": highest_severity,
            "has_risk": highest_severity in ["CRITICAL", "HIGH", "MEDIUM"],
            "labels": matched_labels,
            "rationale": rationale,
            "suggested_redline": suggested_redline
        }

    def scan_contract(self, raw_text: str) -> Dict[str, Any]:
        """End-to-end scan of an entire contract."""
        clauses = self.segment_contract(raw_text)
        analyzed_clauses = [self.analyze_clause(c) for c in clauses]

        flagged_clauses = [c for c in analyzed_clauses if c["has_risk"]]
        critical_count = sum(1 for c in flagged_clauses if c["severity"] == "CRITICAL")
        high_count = sum(1 for c in flagged_clauses if c["severity"] == "HIGH")
        medium_count = sum(1 for c in flagged_clauses if c["severity"] == "MEDIUM")

        return {
            "total_clauses": len(analyzed_clauses),
            "flagged_clauses_count": len(flagged_clauses),
            "critical_risks": critical_count,
            "high_risks": high_count,
            "medium_risks": medium_count,
            "clauses": analyzed_clauses
        }


if __name__ == "__main__":
    scanner = ClauseGuardScanner()
    sample_text = (
        "Section 3. Customer Indemnification Obligation.\n"
        "Customer shall defend, indemnify and hold harmless Vendor, its affiliates, directors, "
        "and officers from and against any and all claims, damages, liabilities, costs, and expenses.\n\n"
        "Section 4. Limitation of Liability.\n"
        "In no event shall Vendor's aggregate liability exceed the total fees paid by Customer in the "
        "one (1) month preceding the incident, or $100, whichever is less."
    )
    results = scanner.scan_contract(sample_text)
    print(f"Total Sections: {results['total_clauses']}")
    print(f"Flagged Risks: {results['flagged_clauses_count']} (Critical: {results['critical_risks']}, High: {results['high_risks']})")
    for c in results["clauses"]:
        if c["has_risk"]:
            print(f"\n[!] {c['title']} ({c['severity']}):")
            print(f"    Rationale: {c['rationale']}")
            print(f"    Suggested Redline: {c['suggested_redline']}")
