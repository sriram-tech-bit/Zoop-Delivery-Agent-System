# Zoop Backend

Node.js and Express REST API for managing Zoop delivery agents. MongoDB is used for persistent storage, and Redis caches agent read responses.

## Requirements

- Node.js 20.19 or newer (or 22.12 or newer)
- MongoDB, either a local server or MongoDB Atlas
- Redis, either a local server or a hosted Redis provider

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create `src/.env` from the example:

   ```powershell
   Copy-Item src/.env.example src/.env
   ```

   Or on macOS/Linux:

   ```bash
   cp src/.env.example src/.env
   ```

3. Set the values in `src/.env`. Do not commit this file or share its secret values.

4. Start MongoDB and Redis, then run the API:

   ```bash
   npm run dev
   ```

   The API listens on `http://localhost:7000`. For a non-development run, use `npm start`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `URLSTRING` | Yes | MongoDB connection URI, including the database name. |
| `REDIS_HOST` | Yes for Redis caching | Redis hostname. Defaults to `127.0.0.1`. |
| `REDIS_PORT` | Yes for Redis caching | Redis port. Defaults to `6379`. |
| `REDIS_PASSWORD` | If required by Redis | Redis password or access token. Keep it private. |
| `REDIS_TLS` | If required by Redis | Set to `true` when the Redis provider requires TLS. |
| `FRONTEND_ORIGIN` | No | Browser origin to allow through CORS. Defaults to `http://localhost:5173`. Local development also allows `http://localhost:5174` and `http://127.0.0.1:5174`. |

Example formats (replace placeholders locally; do not use them as credentials):

```dotenv
URLSTRING=mongodb://127.0.0.1:27017/zoop
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TLS=false
FRONTEND_ORIGIN=http://localhost:5173
```

For MongoDB Atlas, use the connection URI supplied by Atlas as `URLSTRING`. For a hosted Redis service, use the host, port, password, and TLS settings supplied by that provider.

## Database

This project uses MongoDB through Mongoose. There are no separate migration scripts. Mongoose creates the `agents` collection when an agent is first saved; unique indexes are declared for phone and email in the agent schema. Start a local MongoDB server or provide an Atlas URI before starting the API.

Agent documents contain:

- `fullName`
- `phone` (validated as an Indian mobile number)
- `email` (validated and stored lowercase)
- `serviceArea`
- `status` (`active` or `inactive`, defaults to `active`)
- `createdAt` and `updatedAt` (managed by Mongoose timestamps)

## API

All endpoints use JSON. The API base URL is `http://localhost:7000`.

| Method | Path | Description | Success |
| --- | --- | --- | --- |
| `POST` | `/agents` | Create an agent | `201 Created` |
| `GET` | `/agents` | List agents | `200 OK` |
| `GET` | `/agents/:id` | Get one agent by MongoDB ID | `200 OK` |
| `PATCH` | `/agents/:id` | Update name, phone, service area, or status | `200 OK` |
| `DELETE` | `/agents/:id` | Delete an agent | `200 OK` |

Example create request:

```bash
curl -X POST http://localhost:7000/agents \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Priya Sharma","phone":"9876543210","email":"priya@example.com","serviceArea":"Indiranagar, Bengaluru","status":"active"}'
```

The list and individual-agent endpoints respond with a `data` property. Create and update responses include a success `message` and the saved agent in `data`. Invalid input returns `400`, a duplicate email/phone returns `409 Conflict` (the current duplicate-key message is `Email already exists`), an invalid MongoDB ID returns `400`, and a valid but unknown ID returns `404`.

Email cannot be changed using `PATCH`; create a new agent if an email address must be replaced.

## Redis caching

`GET /agents` and `GET /agents/:id` responses are cached in Redis for five minutes (300 seconds). The response header `X-Cache` is set to `HIT` for cached responses and `MISS` when the API reads from MongoDB. Creating an agent invalidates the list cache. Updating or deleting an agent invalidates both the list cache and that agent's detail cache.

Redis must be reachable using the configured Redis environment variables. Cache read/clear failures are logged, and cache read failures fall through to MongoDB.

## Test the CRUD flow

No automated test suite is currently configured. With MongoDB, Redis, and the API running, exercise the main flow using the example create request above:

1. Save the returned `_id`.
2. List agents with `curl http://localhost:7000/agents` and inspect the `X-Cache` header. Repeat to check for a cache hit.
3. Fetch the individual record with `curl -i http://localhost:7000/agents/<ID>`.
4. Update it:

   ```bash
   curl -X PATCH http://localhost:7000/agents/<ID> \
     -H "Content-Type: application/json" \
     -d '{"serviceArea":"Koramangala, Bengaluru","status":"inactive"}'
   ```

5. Fetch it again to confirm the update and cache invalidation.
6. Delete it:

   ```bash
   curl -X DELETE http://localhost:7000/agents/<ID>
   ```

7. Fetch the deleted ID again and confirm the API returns `404`.

Use a real MongoDB ObjectId in place of `<ID>`. Requests that create data should use unique email and phone values.
