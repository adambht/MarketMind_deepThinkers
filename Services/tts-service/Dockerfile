FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsndfile1 \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py database.py tts.py model_loader.py ./
COPY speaker_embeddings.npy ./
COPY model/ ./model/
RUN mkdir -p outputs && chmod 777 outputs

ENV MONGO_URL=mongodb://mongo:27017
ENV DB_NAME=tts_service
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
