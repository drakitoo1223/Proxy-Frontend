# Proxy Frontend

This frontend demonstrates how a client interacts with a protected backend using a proxy-based architecture.

## Features

- loads resources from the backend,
- shows different access states by user role,
- explains the concept visually and in code.

## Run locally

```bash
npm install
npm run dev
```

Then open the Vite app in the browser.

## Production deployment

For Vercel, deploy this project as a standard Vite app. Set the environment variable `VITE_API_URL` to your deployed backend endpoint.
