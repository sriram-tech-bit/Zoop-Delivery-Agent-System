# Zoop Delivery Agent Management System

A web application for managing delivery agents. Users can add agents, browse and search the directory, filter by status, view agent details, update records, and delete agents.

## Live application

- Frontend: https://zoop-frontend-32huh4xi2-c-srirams-projects.vercel.app
- Backend API: https://zoop-backend-u9t5.onrender.com

## Source code

- Combined frontend and backend repository: https://github.com/sriram-tech-bit/Zoop-Delivery-Agent-System
- Frontend source folder: `zoopFrontend/`
- Backend source folder: `zoopBackend/`

If a URL is not clickable in the document preview, copy the full address and paste it into Chrome's address bar.

## Technology

- **Frontend:** React, Vite, and Tailwind CSS
- **Backend:** Node.js and Express
- **Persistent database:** MongoDB
- **Read-response cache:** Redis

The backend provides CRUD endpoints for delivery agents. Redis caches agent-list and individual-agent reads for five minutes. Creating an agent clears the list cache; updating or deleting an agent clears the list cache and that agent's detail cache.

## Agent information

Each agent record contains a full name, phone number, email address, service area, active/inactive status, and created/updated timestamps.

## How to test

1. Open the live frontend.
2. Add a delivery agent using a valid Indian mobile number and a unique email address.
3. Search for the agent, and try filtering the list by active or inactive status.
4. Open the agent details and update a field such as service area or status.
5. Delete the test agent.

Backend setup, environment variable names, API endpoint details, and additional CRUD test commands are documented in `zoopBackend/README.md`. Frontend setup instructions are in `zoopFrontend/README.md`. No database or Redis credentials are included in this document.
