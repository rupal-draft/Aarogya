from fastapi import FastAPI, Request
from pydantic import BaseModel
import spacy
from spacy.matcher import PhraseMatcher

app = FastAPI(title="Medicine Extractor API", version="1.0.0")


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


@app.post("/extract-medicines", response_model=FoundMedicineListResponse)
async def extract_medicines(request: MedicineListRequest):
    medicines_found = spacy_utils.extract_medicines(request.text, request.medicine_list)
    return FoundMedicineListResponse(medicines_found=medicines_found)


# Run using: uvicorn spacy_service:app --host 0.0.0.0 --port 5000
