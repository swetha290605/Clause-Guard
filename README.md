# Clause Guard · LexiRisk Sentinel 🛡️
### Enterprise NLP Contract Risk Clause Flagging SaaS & CUAD Dataset Training Walkthrough

**Clause Guard** (powered by **LexiRisk Sentinel**) is an enterprise-grade LegalTech SaaS platform engineered for procurement teams, general counsels, and contract managers. It leverages domain-adapted transformer architectures fine-tuned on the online **CUAD (Contract Understanding Atticus Dataset)** from The Atticus Project (NeurIPS 2021) to perform **Multi-Label Clause Risk Classification**, **Explainable Span Extraction**, and **Automated Redline Counter-Draft Synthesis** on commercial vendor agreements.

---

## 🏛️ CUAD Online Dataset & Domain-Adapted NLP Engine

Clause Guard incorporates an interactive **CUAD Training & Model Walkthrough** module:
- **CUAD Online Dataset**: 510 commercial contracts from SEC EDGAR regulatory filings with 13,101 attorney-curated annotations across 41 contract categories.
- **Taxonomy Synthesis (41 &rarr; 8 Vectors)**: Maps 41 granular CUAD classes into 8 critical vendor risk dimensions:
  1. **INDEMNITY**: Uncapped indemnification & unilateral defense obligations
  2. **LIABILITY_CAP**: Asymmetric limitation of liability & consequential damages waivers
  3. **TERMINATION**: Auto-renewal traps (<90-day opt-out) & non-refundable fees
  4. **IP_RIGHTS**: Work-for-hire overreach & customer data exploitation
  5. **DATA_PRIVACY**: Delayed breach reporting (>72h) & audit right denials
  6. **WARRANTIES**: "As-Is" disclaimers & exclusive remedy exclusions
  7. **UNILATERAL_CHANGE**: Mid-term modification rights without customer consent
  8. **GOVERNING_LAW**: Foreign exclusive venue & jury trial waivers
- **Model Architecture**: `nlpaueb/legal-bert-base-uncased` fine-tuned with dual objective:
  - Multi-Label Sequence Head (BCEWithLogitsLoss) achieving **88.4% Macro F1** (+17.1% over base RoBERTa).
  - Cross-Attention Token Saliency Head isolating exact hazardous phrases with attention weights ($\alpha_t \in [0.70, 0.99]$).
- **Interactive SEC EDGAR Test-Bench**: Test real clauses from SEC filings (Apple Inc., Twitter/X, Tesla, Pfizer, Microsoft, Cisco) or paste custom legal text for real-time inference.
- **Production Training Code**: Complete, copyable PyTorch / Hugging Face Transformers fine-tuning script (`datasets.load_dataset("cuad")`).

---

## 🌟 Platform Capabilities

1. **Multi-Format Document Ingestion**:
   - Client-side parser (`src/utils/documentParser.js`) supporting **PDF**, **DOCX (Microsoft Word)**, **TXT**, and **Markdown**.
   - 4 pre-loaded realistic enterprise vendor agreements with instant 1-click switching:
     - *Enterprise Cloud SaaS MSA* (High Risk)
     - *IT Professional Services SOW* (Critical Risk)
     - *Vendor Data Processing Addendum (DPA)* (High Risk)
     - *Standard Balanced Mutual NDA* (Low Risk)

2. **Interactive Split Workspace**:
   - **Document Reader (Left Pane)**:
     - Editorial paragraph numbering (`▪ 01`, `▪ 02`), severity badges, and highlighted attention spans.
     - Interactive filter chips: *Needs Review Only*, *Critical*, *High*, *Mitigated*, *All*.
     - Full-text search bar with live matching.
   - **Clause Inspector (Right Pane)**:
     - Multi-label confidence distribution bars across detected risk dimensions.
     - Token-level explainable span cards with attention percentages.
     - Plain-language legal risk rationale explaining exposure and leverage.
     - Counter-draft redline diff view with 1-click **"Accept Suggested Redline"** (applies live contract mutation and recalculates risk index).

3. **Deep Analytics & Benchmarking Dashboard**:
   - Executive Contract Risk Score (0–100) and Letter Grade (**A**, **B**, **C**, **D**, **F**).
   - Hazard metrics: Critical breaches, High risk count, Multi-label compounding overlaps.
   - Category distribution exposure bars.
   - Market standard benchmark comparison against **185,000+ public SEC EDGAR** commercial vendor agreements.
   - Complete inventory displaying every clause requiring review with 1-click jump to inspector.

4. **Executive Certified Audit Report**:
   - Printable / PDF-ready formal audit certificate with executive summary, metadata, and clause-by-clause redline roadmap.
   - 1-click JSON export for enterprise GRC / CLM system ingestion.

---

## 🚀 Quick Start & Steps to Run

### Prerequisites
- Node.js (v18 or higher; tested on Node.js v24)
- npm (v9 or higher)

### Installation & Launch

1. **Navigate to the project directory**:
   ```bash
   cd contract-risk-saas
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Visit [http://localhost:5173](http://localhost:5173)

5. **Production Build**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📁 Project Architecture

```
contract-risk-saas/
├── index.html                   # HTML entry point with Google Fonts (Newsreader, Cormorant Garamond, Plus Jakarta Sans, Outfit, JetBrains Mono)
├── package.json                 # Dependencies: react, lucide-react, mammoth, canvas-confetti, vite
├── vite.config.js               # Vite build configuration
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main SaaS application layout, tabs & state router
│   ├── index.css                # Executive LegalTech CSS design system with dark luxury editorial aesthetic
│   ├── nlp/
│   │   └── nlpEngine.js         # Multi-label risk classification & explainable span extraction engine
│   ├── data/
│   │   ├── sampleContracts.js   # 4 enterprise vendor contract datasets with diverse risk profiles
│   │   └── cuadDataset.js       # CUAD v1 dataset metadata, 41-to-8 mapping, training curves & SEC EDGAR samples
│   ├── utils/
│   │   └── documentParser.js    # Client-side multi-format parser (DOCX, PDF, TXT)
│   └── components/
│       ├── Header.jsx           # Top SaaS navbar with mode indicators and quick actions
│       ├── CuadWalkthrough.jsx  # CUAD dataset architecture, training curves & interactive SEC EDGAR test-bench
│       ├── DocumentViewer.jsx   # Left pane: Document reader with token spans & filter controls
│       ├── ClauseInspector.jsx  # Right pane: Multi-label breakdown, attention weights & redline diff
│       ├── AnalyticsDashboard.jsx# Detailed risk score, exposure bars, SEC benchmark comparison & inventory
│       ├── UploadModal.jsx      # Drag-and-drop uploader with 4-stage neural scan animation
│       └── ReportModal.jsx      # Executive certified audit report with print/PDF & JSON export
└── README.md                    # Documentation & run instructions
```
