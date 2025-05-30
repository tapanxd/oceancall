![image](https://github.com/user-attachments/assets/ec4f77cd-4561-4cc6-af78-07b14b4b8e38)


# OceanCall – Whale Sound Classifier

**OceanCall** is an AI-powered marine sound classification system designed to identify whale species from underwater `.wav` audio recordings. The project combines deep audio feature extraction with traditional machine learning classification and is deployed as a scalable, cloud-native application using AWS services.

---

## 🧠 Core Features

- **Whale Species Detection**: Classifies marine audio into five species — Common Dolphin, Humpback Whale, Killer Whale, Pilot Whale, and Sperm Whale.
- **PANNs Embedding Extraction**: Leverages pretrained CNN14 models (from PANNs) to extract robust audio embeddings.
- **XGBoost Classification**: Lightweight, high-performance model for final species prediction.
- **Real-Time Inference**: Supports low-latency predictions via AWS Lambda and SageMaker.

---

## 🛠️ Tech Stack

| Component         | Technology Used                          |
|------------------|-------------------------------------------|
| Feature Extraction | [PANNs (CNN14)](https://github.com/qiuqiangkong/panns-inference) |
| Classification     | XGBoost                                  |
| Backend (Inference) | AWS Lambda + API Gateway                |
| Model Hosting     | Amazon SageMaker (Containerized Endpoint)|
| Storage           | Amazon S3 (temporary file storage)       |
| Frontend          | Amazon S3 Static Website |

---

## 📦 Architecture Overview

1. **User Uploads** `.wav` audio via web interface.
2. **Lambda Function** validates the file and stores it in **S3**.
3. A **SageMaker Endpoint** is invoked:
   - Loads audio
   - Extracts embeddings via PANNs
   - Predicts species via XGBoost
4. Result is returned to the frontend and visualized with confidence scores and summaries.

---

## 📊 Output

- Predicted Whale Species
- Confidence Probability per Class
- Audio Metadata (duration, sample rate)
- Visual chart of prediction scores

---

