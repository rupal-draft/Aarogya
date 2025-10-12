from src.utils.medicine_extractor import MedicineListRequest, FoundMedicineListResponse, spacy_utils
from fastapi import FastAPI, Request

app = FastAPI(title="Medicine Extractor API", version="1.0.0")


@app.post("/extract-medicines", response_model=FoundMedicineListResponse)
async def extract_medicines(request: MedicineListRequest):
    medicines_found = spacy_utils.extract_medicines(request.text, request.medicine_list)
    return FoundMedicineListResponse(medicines_found=medicines_found)