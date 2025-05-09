##### For Mac only
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npx create-next-app@latest . # will change to npm i 
npm run dev
# build should be added after the app fully works on localhost 
# still working on a better script - not the final one