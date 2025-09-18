# 📸 Visage — Camera & GIF Creator Web App  

A **React + PWA web application** that allows users to **capture selfies, store them on Google Drive, and generate GIFs**.  
Built with **create-react-app**, optimized with **code-splitting**, and enhanced with **Progressive Web App (PWA) features** for offline use and caching.  

🌐 Live demo: [visage-86afe.web.app](https://visage-86afe.web.app)  

## ⚙️ Installation  

```bash
npm install
npm start
npm run build
```

## 🏗️ Architecture

### 1. 🔑 Authentication

- Users can sign in with their Google account.

- Signed-in users’ selfies are uploaded to a dedicated selfies folder in Google Drive.

- Non-signed-in users can still take pictures, which are stored locally on their device.

### 2. 📷 Taking Pictures

- Uses the browser Media API (navigator.mediaDevices.getUserMedia) to access the camera.

- Captured images are either stored locally or synced to Google Drive depending on authentication status.

### 3. 🖼️ Viewing & Creating GIFs

- Signed-in users can view all photos stored in their Google Drive selfies folder.

- Users can generate a GIF from selected pictures with customizable sizes: small, medium, large.

- Created GIFs are available for download.

### 4. 📑 Page Structure

- Home Page → authentication and picture capture

- Gallery Page → manage images, create GIFs

## 🛠️ Tech Stack

- Frontend: [create-react-app](https://create-react-app.dev)

- Authentication & Storage: Google API (Drive integration)

- Camera Access: [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

- Performance: [React code-splitting](https://reactjs.org/docs/code-splitting.html)

- PWA: Offline-first with caching strategies via Workbox

## ⚡ PWA Caching Strategy

The app uses tailored caching strategies for different resources to balance performance and freshness:

### ✅ Implemented

- Folder ID requests (Google Drive API) → Network-first

- Gallery image payload data (JSON responses) → Network-first

- Image thumbnails (Googleusercontent) → Network-first with cacheOpaqueResponsesPlugin

- Full-size image previews (Google Drive) → Network-first with cacheOpaqueResponsesPlugin

### 📝 Potential Improvements

- Full-size gallery images: Background caching when idle → enables offline GIF generation.

- Access/refresh tokens: Explore caching for offline authentication if GAPI is dropped.

- Background sync: Offline upload of captured selfies when connectivity is restored.

- Gallery updates: Merge cached + background-synced images seamlessly.

## 📂 Example Workbox Rules

```js
// Google Drive API responses (CORS)
workbox.routing.registerRoute(
  /.*(?:www.googleapis)\.com.*$/,
  new workbox.strategies.NetworkFirst({
    cacheName: CACHES_NAMES.GOOGLE_APIS
  })
);

// Image thumbnails (opaque responses)
workbox.routing.registerRoute(
  /.*(?:lh3.googleusercontent)\.com.*$/,
  new workbox.strategies.NetworkFirst({
    cacheName: CACHES_NAMES.THUMBNAIL_LINKS,
    plugins: [cacheOpaqueResponsesPlugin]
  })
);

// Full-size image links (opaque responses)
workbox.routing.registerRoute(
  /.*(?:drive.google)\.com.*$/,
  new workbox.strategies.NetworkFirst({
    cacheName: CACHES_NAMES.FULLSIZE_LINKS,
    plugins: [cacheOpaqueResponsesPlugin]
  })
);
```

## 🎯 Key Highlights

- 📷 Seamless camera integration with `getUserMedia`

- ☁️ Google Drive synchronization for signed-in users

- 🎞️ GIF creation with adjustable sizes

- ⚡ Optimized performance with code-splitting & PWA caching

- 🌑 Offline-ready experience with Workbox strategies

## 📄 License

MIT — free to use, adapt, and improve.