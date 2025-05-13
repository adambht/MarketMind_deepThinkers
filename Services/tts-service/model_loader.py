# model_loader.py
import os
import torch
import numpy as np
from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan

device = "cuda" if torch.cuda.is_available() else "cpu"

model_dir = "model"
model = SpeechT5ForTextToSpeech.from_pretrained(model_dir).to(device)
processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan").to(device)

speaker_embeddings = np.load(os.path.join(model_dir, "speaker_embeddings.npy"), allow_pickle=True).item()
