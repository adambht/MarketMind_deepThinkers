FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Set environment variables to avoid interactive prompts
ENV PYTHONUNBUFFERED=1 \
    TRANSFORMERS_NO_ADVISORY_WARNINGS=1 \
    HF_HOME=/app/.cache/huggingface

# Expose the port FastAPI will run on
EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
