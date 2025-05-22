from flask import Flask, request, jsonify
import spacy
from spacy.matcher import PhraseMatcher
import logging

app = Flask(__name__)
app.logger.setLevel(logging.INFO)

nlp = spacy.load("en_core_web_sm")

@app.route("/extract-medicines", methods=["POST"])
def extract_medicines():
    data = request.get_json()
    text = data.get("text")
    medicine_list = data.get("medicine_list", [])

    app.logger.info("Received text: %s", text)
    app.logger.info("Medicine list: %s", medicine_list)

    if not text or not isinstance(medicine_list, list):
        app.logger.warning("Invalid input received.")
        return jsonify({"error": "Invalid input"}), 400

    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    patterns = [nlp.make_doc(med) for med in medicine_list]
    matcher.add("DRUG", patterns)

    doc = nlp(text)
    matches = matcher(doc)
    drugs_found = set(doc[start:end].text for _, start, end in matches)

    app.logger.info("Medicines found: %s", drugs_found)

    return jsonify({"medicines_found": list(drugs_found)})

if __name__ == "__main__":
    app.run(debug=True)
