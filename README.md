# News Menu

This app helps users curate news based on a time constraint, news interest, and chosen persona.

## Running and testing locally

After cloning and cd'ing into the repo:

`cd frontend/news-menu`

`npm install`

`npm run dev`

In api.js, comment out `baseURL: 'https://news-menu.onrender.com'`
and uncomment `baseURL: 'http://127.0.0.1:8000'`

Open a new terminal and cd into the repo again:

`cd backend`

`export OPENAI_API_KEY="..."`
`export NEWS_API_KEY="..."`

`uvicorn server:app --reload`

## After making changes

### Back-end changes (root/backend)

Push the changes.

Wait 1-2 minutes for the Render server to update.

### Front-end changes (root/frontend/news-menu)

In api.js, uncomment `baseURL: 'https://news-menu.onrender.com'`
and comment out `baseURL: 'http://127.0.0.1:8000'`

Push the changes.

`npm run deploy`

Wait 1-2 minutes for Github pages to update.