from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = FastAPI()

model_path = "./tinyllama-ads-merged"


# Force SentencePiece loading
tokenizer = AutoTokenizer.from_pretrained(model_path, use_fast=False)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto"
)










model.eval()

class AdInput(BaseModel):
    product: str
    description: str

@app.post("/generate")
def generate_ad(data: AdInput):
    prompt = (
        "<s>[INST] <<SYS>>\n"
        "Create a text ad given the following product and description.\n"
        "<</SYS>>\n\n"
        f"Product: {data.product}\n"
        f"Description: {data.description}\n"
        "[/INST] Ad:"
    )

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=100,
            temperature=0.6,
            top_p=0.9,
            do_sample=True,
            repetition_penalty=1.2,
            pad_token_id=tokenizer.eos_token_id
        )

    generated = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"ad": generated.split("[/INST] Ad:")[-1].strip()}
