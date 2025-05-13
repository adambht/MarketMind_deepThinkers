# tts.py
import torch
import soundfile as sf
from model_loader import model, processor, vocoder, speaker_embeddings, device
import uuid

def generate_speech(text, speaker_name, output_dir="outputs"):
    if speaker_name not in speaker_embeddings:
        raise ValueError(f"Speaker '{speaker_name}' not found.")

    inputs = processor(text=text, return_tensors="pt").to(device)
    speaker_embedding = torch.tensor(speaker_embeddings[speaker_name]).unsqueeze(0).to(device)

    with torch.no_grad():
        speech = model.generate_speech(inputs["input_ids"], speaker_embedding, vocoder=vocoder)

    # Save as WAV
    filename = f"{uuid.uuid4().hex[:8]}.wav"
    filepath = f"{output_dir}/{filename}"
    sf.write(filepath, speech.cpu().numpy(), 16000)
    return filepath
