import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Determine absolute path to the model directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'model.joblib')

# Load the trained model
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Expected feature columns from the training phase (including one-hot encoded ones)
MODEL_COLUMNS = [
    'person_age', 'person_income', 'person_emp_exp', 'loan_amnt', 
    'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length', 
    'credit_score', 'person_gender_female', 'person_gender_male', 
    'person_education_Associate', 'person_education_Bachelor', 
    'person_education_Doctorate', 'person_education_High School', 
    'person_education_Master', 'person_home_ownership_MORTGAGE', 
    'person_home_ownership_OTHER', 'person_home_ownership_OWN', 
    'person_home_ownership_RENT', 'loan_intent_DEBTCONSOLIDATION', 
    'loan_intent_EDUCATION', 'loan_intent_HOMEIMPROVEMENT', 
    'loan_intent_MEDICAL', 'loan_intent_PERSONAL', 'loan_intent_VENTURE', 
    'previous_loan_defaults_on_file_No', 'previous_loan_defaults_on_file_Yes'
]

def preprocess_input(data):
    # Initialize a dictionary with all expected columns set to 0 (for one-hot encoding)
    processed_data = {col: 0 for col in MODEL_COLUMNS}
    
    # Fill in numeric features
    numeric_features = [
        'person_age', 'person_income', 'person_emp_exp', 'loan_amnt',
        'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length',
        'credit_score'
    ]
    for feature in numeric_features:
        if feature in data:
            processed_data[feature] = float(data[feature])
            
    # Helper to set one-hot encoded columns safely
    def set_one_hot(prefix, value):
        col_name = f"{prefix}_{value}"
        if col_name in MODEL_COLUMNS:
            processed_data[col_name] = 1

    # Apply one-hot encoding logic
    if 'person_gender' in data:
        set_one_hot('person_gender', data['person_gender'])
    
    if 'person_education' in data:
        set_one_hot('person_education', data['person_education'])
        
    if 'person_home_ownership' in data:
        set_one_hot('person_home_ownership', data['person_home_ownership'])
        
    if 'loan_intent' in data:
        set_one_hot('loan_intent', data['loan_intent'])
        
    if 'previous_loan_defaults_on_file' in data:
        set_one_hot('previous_loan_defaults_on_file', data['previous_loan_defaults_on_file'])

    # Convert to DataFrame
    df = pd.DataFrame([processed_data])
    return df

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded on server.'}), 500
        
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided.'}), 400
            
        # Preprocess the data
        df = preprocess_input(data)
        
        # Make prediction
        prediction = model.predict(df)[0]
        # Get probability if available
        probability = None
        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(df)[0][1] # Probability of class 1 (Yes)
            
        result = {
            'prediction': int(prediction),
            'status': 'Approved' if int(prediction) == 1 else 'Not Approved',
            'probability': float(probability) if probability is not None else None
        }
        return jsonify(result)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
