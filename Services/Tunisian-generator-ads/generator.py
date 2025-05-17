import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

model_path = "./model"  # Make sure this folder exists and contains the fine-tuned model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path).to(device)

def generate_ad(name_market, description, max_length=100):
    prompt = f"قم بإنشاء إعلان لنشاط تجاري بالتفاصيل التالية:\nالاسم: {name_market}\nالوصف: {description}\nالإعلان:"
    inputs = tokenizer(prompt, return_tensors="pt")
    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]

    input_ids = input_ids.to(model.device)
    attention_mask = attention_mask.to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,  # <-- ADD THIS
            max_length=max_length,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id  # <-- ENSURE THIS IS SET
        )

    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    ad_text = generated_text.split("الإعلان:")[1].strip() if "الإعلان:" in generated_text else generated_text
    return ad_text

