FROM python:3.10-slim

WORKDIR /app


# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN python -m nltk.downloader stopwords vader_lexicon -d /usr/local/share/nltk_data
RUN pip install huggingface_hub[hf_xet]
RUN mkdir -p /app/static/plots

RUN python -c "from transformers import pipeline; pipeline('text-classification', model='bhadresh-savani/bert-base-uncased-emotion')"
# Copy model files first (if they change less frequently)
COPY model/ ./model/

# Copy application code - including the app directory
COPY app/ ./app/
COPY analyzers/ ./analyzers/
COPY data_scraper/ ./data_scraper/
COPY *.py ./
COPY ./static ./static
COPY .env . 

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]