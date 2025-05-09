# ApplyIQ

## 📃 Description

ApplyIQ is an app based on Perplexity Sonar API to scan the internet in real time for hidden job opportunities, match them to your skills and interests, and auto-generate tailored resumes and cover letters using deep research + reasoning.

## 🎯 Target users

- Job/Internship seekers — especially students, new grads, and career changers.

## 🧠 Why is this a good idea?

- Real problem: Job search is not efficient and _time-consuming_ considering : scattered listings, generic resumes, and missed opportunities.
- Sonar advantage: Real-time search + reasoning + citations means accurate, up-to-date jobs and company insights.
- Unique twist: Combines internet search, research agents, and generative customization (all-in-one).
- Viral potential: People would love a “smart job search AI” that handles search + resume tailoring.

## 💻 Tech stack

- Backend : Python (FastAPI)
- Frontend : NextJS/ReactJS/TSX + Tailwind CSS (or Material UI)
- AI & Search API : Perplexity Sonar API
- Hosting : Vercel

## 👉🏻 Core Features / Use cases

- Feature 1: Smart Job Discovery
  Input: User enters skills/interests
  Sonar API is used to:
  Search for latest jobs matching profile (with filters)
  Get company insights and role expectations using `sonar-deep-research`
  Show real-time results with citations

- Feature 2 : Resume & Cover Letter Tailoring (Bonus / if enough time left before submission)
  Input: Upload basic resume or fill form
  Sonar Reasoning Pro is used to (depends on the credits left on the perplexity account):
  Generate tailored resume keywords for each role
  Auto-write cover letters based on role, company, and resume

- Feature 3 : Interview Prep Bot (Bonus / if enough time left before submission)
  For a selected displayed job, generate:
  List of likely interview questions
  Suggested responses
  Company trivia to impress the recruiter

## ⚙️ Set up the project environment

### Conda virtual environment (fastapi-env)

`conda activate fastapi-env`
`conda deactivate`

### FastAPI and uvicorn

`pip install fastapi uvicorn`

### CORS support for API calls (browser based requests)

`pip install "python-multipart" fastapi[all]` || `pip install fastapi[all]`

### Run the backend

`uvicorn main:app --reload --port 8000`
Runs on : http://127.0.0.1:8000 || http://localhost:8000

### Run the frontend

`npm run dev`
Runs on : http://127.0.0.1:3000 || http://localhost:3000

### Frontend Installed packages

- App Router (Y)
- TypeScript (Y)
- ESLint (Y)
- Turbopack (Y)

### Frontend Installed dependencies

#### Installing dependencies:

- react
- react-dom
- next

#### Installing devDependencies:

- typescript
- @types/node
- @types/react
- @types/react-dom
- @tailwindcss/postcss
- tailwindcss
- eslint
- eslint-config-next
- @eslint/eslintrc

## Summary of Commands to Start Everything -- After the setup

### Backend:

```
cd backend
conda activate fastapi-env
uvicorn main:app --reload --port 8000
```

### Frontend (to be opened in another terminal):

```
cd frontend
npm run dev
```

## More on Perplexity API (can also be found on the website under 'Getting Started')

### Models used

- sonar-deep-research
- sonar

### Roles used

- user
- assistant

### Object of research

The goal of this project is to be able to fetch the AI API thoroughly to retrieve the information needed to locate the positions the user's looking for. To achieve this, the "custom research agents" concept will be efficient since it offers the following options :

- Multi-turn conversations -> user job specifications/conditions
- Advanced reasoning
- More control over model behavior (temperature, stream, etc.)
- Chain-of-thought generation (great for agents, tools, research bots)
  [/chat/completion : "https://api.perplexity.ai/chat/completions"](https://api.perplexity.ai/chat/completions)

## 💡 Further considerations (extensions)

- Add a Chrome extension to scan job boards like LinkedIn
- Track applications and send alerts when new jobs match

## Author

- Kaoutar El Azzab

## License
