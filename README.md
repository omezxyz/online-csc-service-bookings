# Online Services Portal (Full‑Stack)

Generated on 2025-08-20T16:13:07.484509

## Run Backend
```bash
cd backend
cp .env.example .env
# Edit .env with Mongo + Cloudinary keys
npm install
npm run seed
npm run dev
```
API runs at http://localhost:4000

## Run Frontend
```bash
cd frontend
npm install
npx tailwindcss init -p  # if not generated automatically
npm run dev
```
Open http://localhost:5173

## Notes
- Update CLIENT_ORIGIN in backend .env if frontend runs elsewhere.
- Uploads use Cloudinary; switch to disk storage if needed.
