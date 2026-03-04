\# PharmaGuard — Pharmacogenomic Risk Prediction System



RIFT 2026 Hackathon | HealthTech Track | Precision Medicine



\## Links

\- Live Demo: \[Add after deployment]

\- Demo Video: \[Add LinkedIn URL after recording]

\- GitHub: https://github.com/sagr12004/pharmaguard



---



\## Overview



PharmaGuard analyzes patient genetic data (VCF files) and predicts personalized pharmacogenomic risks with clinically actionable recommendations aligned to CPIC guidelines.



Adverse drug reactions kill over 100,000 Americans annually. Many are preventable through pharmacogenomic testing. PharmaGuard makes this analysis fast, accurate, and explainable.



---



\## Architecture

```

Frontend (React + Vite)  -->  Backend (FastAPI + Python)  -->  Groq LLM API

&nbsp;    Vercel                        Render                    LLaMA 3.3 70B

```



---



\## Supported Genes and Drugs



| Drug | Gene | Risk |

|------|------|------|

| CODEINE | CYP2D6 | Toxicity / Inefficacy |

| WARFARIN | CYP2C9 | Bleeding |

| CLOPIDOGREL | CYP2C19 | Inefficacy |

| SIMVASTATIN | SLCO1B1 | Myopathy |

| AZATHIOPRINE | TPMT | Toxicity |

| FLUOROURACIL | DPYD | Toxicity |



---



\## Tech Stack



\- Frontend: React, Vite

\- Backend: Python, FastAPI

\- LLM: Groq API (LLaMA 3.3 70B)

\- Guidelines: CPIC

\- Deployment: Vercel, Render



---



\## Installation



\### Backend

```bash

cd backend

python -m venv venv

venv\\Scripts\\activate

pip install -r requirements.txt

uvicorn app.main:app --reload

```



\### Frontend

```bash

cd frontend

npm install

npm run dev

```



---



\## Sample VCF Files



Located in `/sample\_vcf/`:

\- `patient\_001\_normal.vcf` — Normal metabolizer

\- `patient\_002\_toxic.vcf` — Ultra-rapid metabolizer

\- `patient\_003\_poor\_metabolizer.vcf` — Poor metabolizer



---



\## Team



\- Sagar — Developer



---



\## License



MIT License

