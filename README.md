# OceanCall – Whale Sound Classifier

![OceanCall Screenshot](https://github.com/user-attachments/assets/ec4f77cd-4561-4cc6-af78-07b14b4b8e38)

<center><strong>OceanCall Live website:</strong> https://d1yk22cxi63m6w.cloudfront.net/</center>

---

**OceanCall** is an AI-powered marine sound classification system designed to identify whale species from underwater `.wav` audio recordings. The project combines deep audio feature extraction with traditional machine learning classification and is deployed as a scalable, cloud-native application using AWS services.

---

## 🧠 Core Features

- **Whale Species Detection**: Classifies marine audio into five species — Common Dolphin, Humpback Whale, Killer Whale, Pilot Whale, and Sperm Whale.
- **PANNs Embedding Extraction**: Leverages pretrained CNN14 models (from PANNs) to extract robust audio embeddings.
- **XGBoost Classification**: Lightweight, high-performance model for final species prediction.
- **Real-Time Inference**: Supports low-latency predictions via AWS Lambda and SageMaker.

---

## 🛠️ Tech Stack

| Component           | Technology Used                                                     |
|---------------------|---------------------------------------------------------------------|
| Feature Extraction  | [PANNs (CNN14)](https://github.com/qiuqiangkong/panns-inference)    |
| Classification      | XGBoost                                                             |
| Backend (Inference) | AWS Lambda + API Gateway                                            |
| Model Hosting       | Amazon SageMaker Notebook + ngrok endpoint                          |
| Metadata Storage    | Aamzon DynamoDB                                                     |
| Frontend            | Amazon S3 + Amazon CloudFront                                       |

---

## 📦 Architecture Overview

1. **User Uploads** `.wav` audio via the frontend interface.
2. **Lambda Function** validates and converts audio in base64 format.
3. **SageMaker Endpoint** is triggered to:
   - Load and preprocess the audio base64 using librosa
   - Extract PANNs-based embeddings
   - Predict whale species using XGBoost
      - Currently, 5 classes are defined viz. Sperm Whale, Common Dolphin, Long Finned Pilot Whale, Humpback Whale and Killer Whale.    
4. **Prediction Results** are returned to the frontend for display, including confidence scores and metadata.

---

## 📊 Output

- Predicted Whale Species
- Confidence Probability per Class
- Audio Metadata (e.g., duration, sample rate)
- Visual Chart of Prediction Scores

---

## 📚 Dataset Source

This project uses sound files and associated metadata from the **Watkins Marine Mammal Sound Database**, which is made available for academic and personal (non-commercial) use by the **Woods Hole Oceanographic Institution** and the **New Bedford Whaling Museum**.

Please note: *Reposting this work on third-party websites is not permitted.*

**Citation:**  
> "Watkins Marine Mammal Sound Database, Woods Hole Oceanographic Institution and the New Bedford Whaling Museum."

Dataset Link: [https://whoicf2.whoi.edu/science/B/whalesounds/index.cfm](https://whoicf2.whoi.edu/science/B/whalesounds/index.cfm)

---
