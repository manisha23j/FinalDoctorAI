# FinalDoctorAI
this is the final code respository
CISC 699-90- O-2025/Fall - Applied Project in Comp Info Science

DocAI is an end-to-end full-stack application designed to analyze documents using AI/ML models.
This repository contains both the client (React) and server (Node.js + Express + MongoDB) codebases.
________________________________________
Project Structure
root/
 ├── client/        # React frontend
 ├── server/        # Node.js backend
 ├── README.md
________________________________________
Tech Stack
Frontend (Client)
•	React.js (with Hooks + Context API/Redux)
•	Axios for API calls
•	React Router
•	Material-UI
Backend (Server)
•	Node.js + Express.js
•	MongoDB + Mongoose
•	JWT Authentication
•	Multer / Cloud storage (if doc upload)
•	OpenAI Model / OCR Model (if AI used)
________________________________________
⚙️ Installation & Setup
Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
________________________________________
Install dependencies
Client
cd client
npm install
npm start

Server
cd server
npm install
npm start
Note: node_modules folder is removed intentionally and will be downloaded automatically when you run npm install.
________________________________________
Environment Variables
Create a .env file inside the server folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_ai_key_if_used
Create a .env inside client if required:
REACT_APP_API_URL=http://localhost:5000
________________________________________
Running the Project
Start Backend
cd server
npm start
Start Frontend
cd client
npm start
Frontend runs on http://localhost:3000
Backend runs on http://localhost:5000
________________________________________
API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/auth/login	Login user
POST	/api/auth/register	Register user

________________________________________
AI  Workflow
1.	User can chat with a AI Chatbot implemented
2.	Backend processes it through AI
3.	AI returns extracted text or analysis
4.	UI displays results
________________________________________
Production Build
Client
npm run build
Server
npm start
________________________________________
Security
•	Passwords hashed using bcrypt
•	JWT-based authentication
•	Validations for file upload


