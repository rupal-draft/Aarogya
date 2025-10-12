from pathlib import Path
import os
from typing import Dict, Any

BASE_DIR = Path(__file__).parent.parent

DATA_PATH = BASE_DIR / "datasets" / "dialogues.parquet"
MODEL_CACHE_DIR = BASE_DIR / "model_cache"

DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
MODEL_CACHE_DIR.mkdir(parents=True, exist_ok=True)

TFIDF_MAX_FEATURES = 15000
TFIDF_NGRAM_RANGE = (1, 4)
SIMILARITY_THRESHOLD = 0.05
TOP_K_RESULTS = 10

NLTK_PACKAGES = ['punkt', 'stopwords', 'wordnet']
SPACY_MODEL = "en_core_web_sm"


API_HOST = "0.0.0.0"
API_PORT = 8000
API_TITLE = "Enhanced Medical Assistant Chatbot API"
API_DESCRIPTION = "AI-powered medical assistant for symptom analysis, diagnosis prediction, and medical image analysis"
API_VERSION = "1.0.0"

MODEL_DEVICE = "cuda"
MAX_IMAGE_SIZE = 512