from pydantic import BaseModel
import spacy
from spacy.matcher import PhraseMatcher

class MedicineListRequest(BaseModel):
    text: str
    medicine_list: list[str]


class FoundMedicineListResponse(BaseModel):
    medicines_found: list[str]


class SpacyUtils:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def extract_medicines(self, text: str, medicine_list: list[str]) -> list[str]:
        if not text or not isinstance(medicine_list, list):
            return []

        matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        patterns = [self.nlp.make_doc(med) for med in medicine_list]
        matcher.add("DRUG", patterns)

        doc = self.nlp(text)
        matches = matcher(doc)
        drugs_found = {doc[start:end].text for _, start, end in matches}

        return list(drugs_found)


spacy_utils = SpacyUtils()