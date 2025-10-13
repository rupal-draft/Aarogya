import spacy
from spacy.matcher import PhraseMatcher


class SpacyUtils:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def extract_medicines(self, text, medicine_list):
        if not text or not isinstance(medicine_list, list):
            return []

        matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        patterns = [self.nlp.make_doc(med) for med in medicine_list]
        matcher.add("DRUG", patterns)

        doc = self.nlp(text)
        matches = matcher(doc)
        drugs_found = set(doc[start:end].text for _, start, end in matches)

        return list(drugs_found)