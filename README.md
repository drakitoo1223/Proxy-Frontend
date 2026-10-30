# AI Proxy Platform Frontend

This frontend consumes the backend API and displays the quota, rate-limit state, and generated AI response.

## Features

- user selection and plan selection,
- fake prompt input,
- request to the AI proxy,
- quota status panel,
- usage history for the last seven days,
- error handling for rate-limit and quota responses.

## Local execution

```bash
npm install
npm run dev
```

## Vercel deployment

1. Push this repository to GitHub.
2. Go to Vercel and import the project.
3. Select the repository and keep the default Vite configuration.
4. Set the environment variable:

```bash
VITE_API_URL=https://your-backend-url.com
```

5. Deploy.

## Production behavior

The frontend expects the backend to be available at the configured API URL. The app calls:

- `POST /api/generate`
- `GET /api/quota/status`
- `GET /api/quota/history`
- `POST /api/quota/update`
