import torch
import librosa
import numpy as np
import joblib
import io
import sys
from panns_inference import AudioTagging

def model_fn(model_dir):
    global xgb_model, class_map, at_model

    # Load XGBoost model and class map
    xgb_model = joblib.load(f"{model_dir}/whale_xgb_model.pkl")
    class_map = joblib.load(f"{model_dir}/class_map.pkl")
    at_model = AudioTagging(checkpoint_path=None, device="cpu")

    return None  # No explicit model object required

def predict_fn(input_data, model):
    print("⏱ START predict_fn", file=sys.stderr)

    try:
        waveform, _ = librosa.load(io.BytesIO(input_data), sr=32000, mono=True)
        print(f"✅ Loaded audio: {waveform.shape}", file=sys.stderr)

        if len(waveform) < 32000:
            waveform = np.pad(waveform, (0, 32000 - len(waveform)), mode='constant')
            print("🔁 Padded waveform", file=sys.stderr)

        waveform = waveform[None, :]
        with torch.no_grad():
            _, embedding = at_model.inference(waveform)
        print("🎯 Extracted embedding", file=sys.stderr)

        proba = xgb_model.predict_proba(embedding)[0]
        print("📈 Got XGBoost predictions", file=sys.stderr)

        idx_to_class = {v: k for k, v in class_map.items()}
        result = {
            "prediction": idx_to_class[int(np.argmax(proba))],
            "probabilities": {idx_to_class[i]: float(p) for i, p in enumerate(proba)}
        }

        print("✅ Finished predict_fn", file=sys.stderr)
        return result

    except Exception as e:
        print(f"❌ Exception in predict_fn: {e}", file=sys.stderr)
        raise e
