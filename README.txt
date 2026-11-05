FROMVILLE — THE THEORY ROOM

CONTENTS
- index.html: the app
- manifest.webmanifest and icons: installable-app metadata
- sw.js: offline caching

IMPORTANT
This is an installable Progressive Web App (PWA), not an Android APK.
To install it as a real home-screen app, the files must be hosted on an HTTPS website.
One easy free route:
1. Create a GitHub account and a new public repository.
2. Upload all five files from this folder to the repository's root.
3. In repository Settings > Pages, deploy from the main branch and root folder.
4. Open the resulting https://...github.io/... address in Chrome on your Android phone.
5. Tap Chrome's menu (three dots) > Install app (or Add to Home screen).

The app stores notes locally in that browser on that device. Use Export Backup inside the app to save a JSON backup. It does not sync between devices.
