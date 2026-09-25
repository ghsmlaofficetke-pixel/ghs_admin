# GHS MLA Office — Build, Deploy & APK Guide

## 1. New Version Release ಮಾಡುವ ಹೇಗೆ

### Step 1: Version bump
`package.json` ಅಲ್ಲಿ `"version"` field update ಮಾಡಿ:
```json
"version": "1.0.2"
```

### Step 2: Release notes update
`vite.config.ts` ಅಲ್ಲಿ `release_notes` field update ಮಾಡಿ:
```ts
release_notes: `ಈ ಅಪ್ಡೇಟ್ನಲ್ಲಿ:
- ಹೊಸ feature 1
- Bug fix 2
- ಸುಧಾರಣೆ 3`
```

### Step 3: Build
```bash
cd "Frontend New"
yarn build
# or
npm run build
```

### Step 4: Deploy to Firebase
```bash
firebase deploy --only hosting
```

---

## 2. APK File ತಯಾರಿಸುವ ಹೇಗೆ (PWA → Android APK)

### Option A: PWABuilder (FREE, Recommended)
1. https://www.pwabuilder.com ತೆರೆಯಿರಿ
2. App URL ಹಾಕಿ: `https://ghs-frontend.web.app`
3. "Start" → "Android" → "Generate Package" click ಮಾಡಿ
4. `.apk` file download ಆಗ್ತದೆ
5. Phone ಗೆ install ಮಾಡಿ (Settings → Install unknown apps enable ಮಾಡಿ)

### Option B: Bubblewrap (Google Official Tool)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://ghs-frontend.web.app/manifest.webmanifest
bubblewrap build
```
Output: `app-release-signed.apk`

### Option C: Play Store ಗೆ Upload (TWA)
- Bubblewrap ಮೂಲಕ `.aab` file generate ಮಾಡಿ
- Google Play Console ಅಲ್ಲಿ upload ಮಾಡಿ

---

## 3. User ಗೆ Update ಹೇಗೆ ಕಾಣಿಸ್ತದೆ

1. Admin new version deploy ಮಾಡ್ತಾರೆ
2. User app open ಮಾಡಿದ್ದಾರೆ (ಅಥವಾ 30 min ಆಗಿದೆ)
3. Screen ಮೇಲೆ popup ಬರ್ತದೆ: "ಹೊಸ ಅಪ್ಡೇಟ್ ಲಭ್ಯ ಇದೆ! Version X.X.X"
4. "ಈಗ ಅಪ್ಡೇಟ್ ಮಾಡಿ" button click ಮಾಡಿದ್ರೆ app reload ಆಗ್ತದೆ
5. "ನಂತರ" click ಮಾಡಿದ್ರೆ popup ಮುಚ್ಚ್ತದೆ, ಮತ್ತೆ ಕಾಣಿಸಲ್ಲ (same version)

---

## 4. Environment Variables

### Production deploy ಮಾಡುವ ಮೊದಲು `.env` update ಮಾಡಿ:
```env
VITE_API_BASE_URL=https://whale-app-ebka5.ondigitalocean.app/api
```

### Dev ಗಾಗಿ:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## 5. Security Features (Already Implemented)

- ✅ JWT token expiry check (PrivateRoute)
- ✅ Single device session (auth middleware)
- ✅ Token version invalidation (force logout)
- ✅ Rate limiting (backend)
- ✅ Helmet security headers (backend)
- ✅ Firebase hosting security headers
- ✅ XSS protection meta tags
- ✅ CORS whitelist (backend)
- ✅ Request deduplication + cache (apiCore)
