```markdown
# LOL — Starter Scaffold (Next.js + Firebase)

This scaffold provides a professional starting point for the LOL anonymous Q&A app:
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Firebase client & admin helpers
- /ask/[username] send-flow (client form -> POST /api/messages -> admin save)
- Simple Perspective moderation hook (configurable via env)

Quick start
1. Copy files to a folder (or run `bash scripts/create_zip.sh`).
2. Install deps: `npm install`
3. Create `.env.local` with the required variables (see below).
4. Run: `npm run dev`
5. Open: http://localhost:3000

Environment variables (.env.local)
- NEXT_PUBLIC_FIREBASE_API_KEY=
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
- NEXT_PUBLIC_FIREBASE_PROJECT_ID=
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
- NEXT_PUBLIC_FIREBASE_APP_ID=
- FIREBASE_SERVICE_ACCOUNT= (base64-encoded service account JSON) — server only
- PERSPECTIVE_API_KEY= (optional)
- TOXICITY_THRESHOLD=0.85 (optional)

Security notes
- Keep FIREBASE_SERVICE_ACCOUNT and PERSPECTIVE_API_KEY server-side only.
- For production, set secrets in your hosting provider.
- Add rate-limiting or reCAPTCHA for anonymous senders to control spam.

What’s included
- src/app/ask/[username]/page.tsx — send message page
- src/components/MessageForm.tsx — client form
- src/app/api/messages/route.ts — server API, moderation + Firestore save
- src/lib/firebaseClient.ts — client init
- src/lib/firebaseAdmin.ts — server admin init
- Basic layout and home page
- scripts/create_zip.sh — generate files & zip

Next steps I can help with
- Add auth / inbox with real-time Firestore listeners
- Cloud Functions for push/email notifications
- Admin dashboard and reporting

Enjoy — want me to generate Phase 1 GitHub issues next?
```