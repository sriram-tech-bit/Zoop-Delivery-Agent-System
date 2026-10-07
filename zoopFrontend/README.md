# Zoop Frontend

React and Vite frontend for the Zoop delivery-agent management system.

## Requirements

- Node.js 20.19 or newer (or 22.12 or newer)
- The Zoop backend running at `http://localhost:7000` (or a configured API URL)

## Setup and run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev -- --port 5174
   ```

   Open the local URL printed by Vite, normally `http://localhost:5174`. The backend allows this local origin by default. If you want to use another origin, set `FRONTEND_ORIGIN` in the backend environment file and restart the backend.

3. To build and preview the production bundle:

   ```bash
   npm run build
   npm run preview
   ```

4. Run the linter:

   ```bash
   npm run lint
   ```

## Configuration

The API defaults to `http://localhost:7000`. To use a different API base URL, create a `.env` file in the frontend project directory:

```dotenv
VITE_API_BASE_URL=http://localhost:7000
```

Vite exposes `VITE_` variables to browser code. Do not put passwords, database URIs, or other secrets in frontend environment variables.

## Using the app

The dashboard supports adding, listing, searching, filtering, viewing, updating, and deleting delivery agents. Agent records are stored by the backend; see the backend repository README for MongoDB/Redis setup and API details.

To test the main CRUD flow, run both projects, add an agent with a valid Indian mobile number and unique email, open the agent to check its details, edit its name/phone/service area/status, then delete it. The UI displays API validation errors and refreshes the list after successful changes.
