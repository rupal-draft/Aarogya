import spacy
import subprocess
import sys
from spacy.matcher import PhraseMatcher

class SpacyUtils:
    def __init__(self):
        self.nlp = self._load_spacy_model()

    def _load_spacy_model(self):
        try:
            return spacy.load("en_core_web_sm")
        except OSError:
            print("⚠️ spaCy model not found. Attempting to download...")
            self.download_spacy_model()
            return spacy.load("en_core_web_sm")

    def extract_medicines(self, text, medicine_list):
        """Extract medicine names from text using PhraseMatcher"""
        if not text or not isinstance(medicine_list, list):
            return []

        matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        patterns = [self.nlp.make_doc(med) for med in medicine_list]
        matcher.add("DRUG", patterns)

        doc = self.nlp(text)
        matches = matcher(doc)
        drugs_found = {doc[start:end].text for _, start, end in matches}

        return list(drugs_found)

    def download_spacy_model(self):
        """Download spaCy English model into the current environment"""
        print("🔧 Downloading spaCy model...")
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install",
                "https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1.tar.gz"
            ])
            print("✅ spaCy model installed successfully!\n")
        except subprocess.CalledProcessError as e:
            print(f"❌ spaCy model download failed: {e}")
            sys.exit(1)
