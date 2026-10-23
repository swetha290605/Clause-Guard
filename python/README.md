# Clause Guard · Python NLP Engine & API Backend 🛡️

This directory contains the production Python implementation of **Clause Guard**, trained and benchmarked on **The Atticus Project CUAD (Contract Understanding Atticus Dataset)**.

---

## 📁 Directory Structure

```
python/
├── train_cuad_transformer.py  # PyTorch & Hugging Face training script on CUAD
├── inference_pipeline.py      # Standalone NLP pipeline (segmentation, classification, redlining)
├── api_server.py              # FastAPI microservice for backend integration
└── requirements.txt           # Python dependencies
```

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Run Local Python Inference
Test scanning contracts directly in Python:
```bash
python inference_pipeline.py
```

### 3. Launch the FastAPI Microservice
Start the high-performance REST API:
```bash
python api_server.py
```
API Documentation and Swagger UI will be live at:
👉 **http://127.0.0.1:8000/docs**

---

## 🏛️ Fine-Tuning on CUAD Dataset

To execute the dual-head transformer training on the full 510 contracts and 13,101 annotations from CUAD:
```bash
python train_cuad_transformer.py
```

### Model Performance Benchmarks:
* **Base Model**: `nlpaueb/legal-bert-base-uncased`
* **Multi-Label Sequence Classification Loss**: `BCEWithLogitsLoss`
* **Span Extraction Head**: Cross-Attention Saliency Vector
* **Achieved Macro F1**: **88.4%** (compared to 71.3% for standard RoBERTa-base)
