# Student Dost — Live AI Tutor setup

This project keeps the Gemini API key on the server. Never paste your API key into `public/index.html`, `server.js`, or a public chat.

## What is included
- `public/index.html` — Student Dost app, updated to call `/api/chat`
- `server.js` — secure server-side Gemini API proxy
- `package.json` — Node.js dependencies and start command

## Deploy
1. Create a Node.js web service with a host that supports environment variables/secrets.
2. Upload/extract this project, keeping the `public` folder.
3. Set the build/install command to `npm install`.
4. Set the start command to `npm start`.
5. In the host's Environment Variables / Secrets settings, add:
   - Name: `GEMINI_API_KEY`
   - Value: your Gemini API key (enter it only on the hosting provider's private settings page).
6. Deploy the service and open its public URL.
7. Test `YOUR-APP-URL/api/health`. It should show `{"ok":true,"apiKeyConfigured":true}`.
8. Open the app, go to AI Tutor, and ask a simple question.

## Important
- The downloaded HTML file by itself cannot securely call Gemini. Use this server-backed project on a host that runs Node.js.
- Never share the API key in chat or screenshots.
- Gemini model availability, quotas, and charges depend on your Google AI Studio account and current Google terms.
