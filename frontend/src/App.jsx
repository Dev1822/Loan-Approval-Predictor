import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Calculator } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    person_age: '',
    person_gender: '',
    person_education: '',
    person_income: '',
    person_emp_exp: '',
    person_home_ownership: '',
    loan_amnt: '',
    loan_intent: '',
    loan_int_rate: '',
    loan_percent_income: '',
    credit_score: '',
    cb_person_cred_hist_length: '',
    previous_loan_defaults_on_file: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Auto calculate loan_percent_income
  useEffect(() => {
    const income = parseFloat(formData.person_income);
    const amount = parseFloat(formData.loan_amnt);
    if (income > 0 && amount >= 0) {
      setFormData(prev => ({
        ...prev,
        loan_percent_income: (amount / income).toFixed(2)
      }));
    }
  }, [formData.person_income, formData.loan_amnt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = { ...formData };
      const numericFields = ['person_age', 'person_income', 'person_emp_exp', 'loan_amnt', 'loan_int_rate', 'loan_percent_income', 'cb_person_cred_hist_length', 'credit_score'];
      
      numericFields.forEach(field => {
        if (payload[field]) payload[field] = parseFloat(payload[field]);
      });

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to get prediction from server. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="w-full">
      <header className="text-center mb-12 animate-fadeInDown">
        <div className="inline-flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
            LoanPredict AI
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Enter your details to instantly predict your loan approval chances.</p>
      </header>

      <main className="animate-fadeInUp">
        {!result ? (
          <div className="bg-bg-card rounded-2xl p-8 shadow-2xl border border-gray-800">
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Personal Info */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400 focus-within:text-primary transition-colors">Age</label>
                  <input type="number" name="person_age" min="18" max="100" required placeholder="e.g. 25" value={formData.person_age} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Gender</label>
                  <select name="person_gender" required value={formData.person_gender} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none">
                    <option value="" disabled>Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Education</label>
                  <select name="person_education" required value={formData.person_education} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none">
                    <option value="" disabled>Select Education</option>
                    <option value="High School">High School</option>
                    <option value="Associate">Associate</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                </div>

                {/* Financial Info */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Annual Income ($)</label>
                  <input type="number" name="person_income" min="0" required placeholder="e.g. 60000" value={formData.person_income} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Employment Exp (Years)</label>
                  <input type="number" name="person_emp_exp" min="0" required placeholder="e.g. 5" value={formData.person_emp_exp} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Home Ownership</label>
                  <select name="person_home_ownership" required value={formData.person_home_ownership} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none">
                    <option value="" disabled>Select Ownership</option>
                    <option value="RENT">Rent</option>
                    <option value="MORTGAGE">Mortgage</option>
                    <option value="OWN">Own</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Loan Info */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Loan Amount ($)</label>
                  <input type="number" name="loan_amnt" min="100" required placeholder="e.g. 15000" value={formData.loan_amnt} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Loan Intent</label>
                  <select name="loan_intent" required value={formData.loan_intent} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none">
                    <option value="" disabled>Select Intent</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="EDUCATION">Education</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="VENTURE">Venture</option>
                    <option value="HOMEIMPROVEMENT">Home Improvement</option>
                    <option value="DEBTCONSOLIDATION">Debt Consolidation</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Interest Rate (%)</label>
                  <input type="number" name="loan_int_rate" step="0.01" min="0" max="100" required placeholder="e.g. 10.5" value={formData.loan_int_rate} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Loan Percent of Income</label>
                  <input type="number" name="loan_percent_income" step="0.01" readOnly value={formData.loan_percent_income}
                    className="bg-gray-800 border border-gray-700 text-gray-500 px-4 py-3 rounded-lg outline-none cursor-not-allowed" />
                </div>

                {/* Credit Info */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Credit Score</label>
                  <input type="number" name="credit_score" min="300" max="850" required placeholder="e.g. 720" value={formData.credit_score} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Credit Hist Length (Yrs)</label>
                  <input type="number" name="cb_person_cred_hist_length" min="0" required placeholder="e.g. 4" value={formData.cb_person_cred_hist_length} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">Previous Defaults?</label>
                  <select name="previous_loan_defaults_on_file" required value={formData.previous_loan_defaults_on_file} onChange={handleChange}
                    className="bg-bg-input border border-gray-700 text-gray-100 px-4 py-3 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none">
                    <option value="" disabled>Select Option</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white font-semibold text-lg flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)]">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Processing...' : 'Analyze Profile'}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-scaleIn bg-bg-card border border-gray-800 shadow-2xl rounded-2xl p-12 max-w-2xl mx-auto text-center">
            {result.prediction === 1 ? (
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
            ) : (
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-red-500/10 border-2 border-red-500 text-red-500">
                  <XCircle className="w-12 h-12" />
                </div>
              </div>
            )}
            
            <h2 className={`text-3xl font-bold mb-3 ${result.prediction === 1 ? 'text-emerald-500' : 'text-red-500'}`}>
              {result.prediction === 1 ? 'Loan Approved' : 'Loan Not Approved'}
            </h2>
            
            <p className="text-gray-400 text-lg mb-8">
              {result.prediction === 1 
                ? 'Congratulations! Based on your profile, you have a high chance of getting this loan.'
                : 'Unfortunately, your profile currently does not meet the requirements for this loan.'}
            </p>

            {result.probability != null && (
              <div className="bg-bg-input rounded-xl p-6 mb-8 text-left border border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-200">Approval Probability</span>
                  <span className="font-bold text-xl">{Math.round(result.probability * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1500 ease-out ${result.prediction === 1 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.round(result.probability * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <button onClick={resetForm}
              className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white font-semibold text-lg transition-transform hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(79,70,229,0.4)]">
              Calculate Another
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
