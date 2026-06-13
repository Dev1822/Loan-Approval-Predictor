# Loan Approval Prediction

This is a full-stack web application designed to predict the likelihood of loan approval based on user data. The project consists of a Python backend that serves a machine learning model and a React frontend for the user interface.

## Project Structure

- `frontend/`: Contains the React application built with Vite and Tailwind CSS.
- `backend/`: Contains the backend API built with Python (likely Flask or FastAPI) which runs the machine learning model.

## Getting Started

### Prerequisites

- Node.js (for the frontend)
- Python 3.8+ (for the backend)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the backend server:
   ```bash
   python app.py
   ```
   *The backend typically runs on port 5000 (Flask default).*

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on http://localhost:5173 by default.*

## Usage

Once both the frontend and backend servers are running, open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`). Fill out the required details in the form to get an instant loan approval prediction.

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Lucide React (for icons)
- **Backend**: Python, Machine Learning Model
