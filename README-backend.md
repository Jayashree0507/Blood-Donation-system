Sanguis — Simple Backend

Files added:
- `server.js` — Express server with API endpoints and static file serving
- `db.json` — simple JSON datastore with sample inventory
- `package.json` — Node project metadata

Quick start (Node.js required):

1. Install dependencies:

```powershell
cd "c:\Users\acer\OneDrive\Desktop\final yr project"
npm install
```

2. Start server:

```powershell
npm start
```

3. Open the app in browser:

http://localhost:3000/index.html

API endpoints:
- `GET /api/inventory?loc=New%20York&type=A+` — search inventory
- `POST /api/request` — submit a request (JSON body)
- `POST /api/contact` — submit contact form (JSON body)

Notes:
- This is a minimal demo backend using a JSON file for persistence (`db.json`).
- For production use, switch to a proper database and add validation/auth.
