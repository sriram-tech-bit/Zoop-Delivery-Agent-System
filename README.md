# Zoop Delivery Agent Management System

Full-stack delivery-agent management application, organized as a single repository.

## Repository structure

- `zoopBackend/` — Node.js and Express API, MongoDB persistence, and Redis caching.
- `zoopFrontend/` — React and Vite application.

Each project has its own README with detailed setup and testing instructions:

- [Backend setup](./zoopBackend/README.md)
- [Frontend setup](./zoopFrontend/README.md)

## Run locally

1. Configure `zoopBackend/src/.env` using `zoopBackend/src/.env.example`. Set your MongoDB and Redis connection details locally; never commit secrets.
2. Start MongoDB and Redis.
3. In one terminal, start the API:

   ```bash
   cd zoopBackend
   npm install
   npm run dev
   ```

4. In another terminal, start the frontend:

   ```bash
   cd zoopFrontend
   npm install
   npm run dev -- --port 5174
   ```

5. Open the Vite URL printed in the terminal (typically `http://localhost:5174`).

The frontend defaults to an API at `http://localhost:7000`. Set `VITE_API_BASE_URL` in `zoopFrontend/.env` only if your API is hosted elsewhere. The backend accepts the default local Vite origins; set `FRONTEND_ORIGIN` for a deployed frontend.

## Deployment

The frontend and backend can be deployed independently from this monorepo by setting the hosting service's root directory to `zoopFrontend` or `zoopBackend`, respectively. Configure production environment variables in the hosting provider dashboard, not in Git.

## Security

Environment files and dependency/build directories are excluded by `.gitignore`. Use the `.env.example` file as a template and provide private credentials through your deployment provider's environment settings.
