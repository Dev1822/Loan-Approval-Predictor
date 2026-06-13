from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load("./model/model.joblib")


@app.route("/")
def home():
    return "Flask is running"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = [
        float(data.get("person_age", 0)),
        float(data.get("person_income", 0)),
        float(data.get("person_emp_exp", 0)),
        float(data.get("loan_amnt", 0)),
        float(data.get("loan_int_rate", 0)),
        float(data.get("loan_percent_income", 0)),
        float(data.get("cb_person_cred_hist_length", 0)),
        float(data.get("credit_score", 0)),
        1 if data.get("person_gender") == "female" else 0,
        1 if data.get("person_gender") == "male" else 0,
        1 if data.get("person_education") == "Associate" else 0,
        1 if data.get("person_education") == "Bachelor" else 0,
        1 if data.get("person_education") == "Doctorate" else 0,
        1 if data.get("person_education") == "High School" else 0,
        1 if data.get("person_education") == "Master" else 0,
        1 if data.get("person_home_ownership") == "MORTGAGE" else 0,
        1 if data.get("person_home_ownership") == "OTHER" else 0,
        1 if data.get("person_home_ownership") == "OWN" else 0,
        1 if data.get("person_home_ownership") == "RENT" else 0,
        1 if data.get("loan_intent") == "DEBTCONSOLIDATION" else 0,
        1 if data.get("loan_intent") == "EDUCATION" else 0,
        1 if data.get("loan_intent") == "HOMEIMPROVEMENT" else 0,
        1 if data.get("loan_intent") == "MEDICAL" else 0,
        1 if data.get("loan_intent") == "PERSONAL" else 0,
        1 if data.get("loan_intent") == "VENTURE" else 0,
        1 if data.get("previous_loan_defaults_on_file") == "No" else 0,
        1 if data.get("previous_loan_defaults_on_file") == "Yes" else 0
    ]

    prediction = model.predict([features])

    return jsonify({
        "prediction": int(prediction[0])
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)