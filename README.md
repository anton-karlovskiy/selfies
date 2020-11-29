
## Installation

```
npm install
npm start
npm run build
```

## Build version on Firebase

https://visage-86afe.web.app

## Architecture

1. Authentication
    
    Users sign in to the app with their Google accounts on the home page.

2. Taking a picture

    Users can take a picture and save it.

    If a signed-in user takes a picture, it is uploaded to the "selfies" folder in his/her Google Drive.
    If a non-signed-in user takes a picture, it is stored in his/her device.

3. Viewing pictures and creating a GIF

    Signed-in users can view pictures they have taken and create a GIF file made up of some of the pictures.

    Users can see all the pictures from the "selfies" folder in their Google Drive.
    Users can also choose one of the sizes among "small" / "medium" / "large" options for the GIF they want to create. The created GIF file is downloaded.

4. Page hierarchy

    This web app consists of 2 pages i.e. Home page and Gallery Page.

## Tech stack

  This web app was bootstrapped with create-react-app.
  It uses a browser API called "navigator.mediaDevices.getUserMedia" to access the device camera and take a picture.
  It uses Google API for authentication and storing pictures to Google Drive.

  This web app uses [code-splitting](https://reactjs.org/docs/code-splitting.html) for performance optimization and is powered by PWA.

### Caching strategy for PWA features

- GET method

  According to https://github.com/addyosmani/launch/issues/9#issue-624626333, I applied the `network-first` caching strategy but I wondered if it would be more appropriate to apply the `cache-first` caching strategy for gallery images since image IDs are unique.
  What about the `stale-while-revalidate` caching strategy for folder ID?

  * How to cache folder ID (DONE)

    URL pattern: `https://www.googleapis.com/drive/v3/files?q=mimeType%3D"application%2Fvnd.google-apps.folder" and fullText contains "selfies" and trashed%3Dfalse&fields=nextPageToken%2C files(id%2C name)&spaces=drive&corpora=user`
    
    Caching strategy: `Network-first`

  * How to cache access token or refresh token for offline use (potential TODO)

    This will be a problem we should dig into when we drop the whole GAPI library. It's beyond discussion for now.

  * How to cache payload data of gallery images (DONE)

    URL pattern (cors response): `https://www.googleapis.com/drive/v3/files?q=mimeType%3D"image%2Fjpeg" and "1k4XuuvGFRCWGRaS4pGPUsEmofSUIttrG" in parents and fullText contains "selfie-" and trashed %3D false&fields=nextPageToken%2C files(id%2C createdTime%2C thumbnailLink)&spaces=drive&corpora=user`
    
    Caching strategy: `Network-first`

  * How to cache sources of gallery images (thumbnails) (DONE)

    URL pattern (opaque response): `https://lh3.googleusercontent.com/2MGOktq7Puhg3T_LoEFKBcE9yKQLsYWluwA3Km912LUXfVhwBvCOQO_v6-ZQO0JCyLiTgGXwVIw=s220`

    Caching strategy: `Network-first`

  * How to update the gallery view with background synced images (uploaded while offline) as well as already cached ones (potential TODO)

    This will be a problem we should dig into when we want to implement uploading a photo while offline using background sync. It's beyond discussion for now.

  * How to cache gallery images (full sizes) that we can open by clicking each tile (TODO)

    For now, we do not cache full-size gallery images but thumbnails so if we could cache them, we would be able to generate a GIF while offline.

    When an image is opened as a preview by clicking the thumbnail, it's cached but it would be much better if we could cache full-size images in the background while the user is in idle status.

  ```
  /**
  * MEMO: cors response
  * MEMO: caching folder ID
  * MEMO: URL pattern -> https://www.googleapis.com/drive/v3/files?q=mimeType%3D"application%2Fvnd.google-apps.folder" and fullText contains "selfies" and trashed%3Dfalse&fields=nextPageToken%2C files(id%2C name)&spaces=drive&corpora=user
  * MEMO: caching payload data of gallery images
  * MEMO: URL pattern -> https://www.googleapis.com/drive/v3/files?q=mimeType%3D"image%2Fjpeg" and "1k4XuuvGFRCWGRaS4pGPUsEmofSUIttrG" in parents and fullText contains "selfie-" and trashed %3D false&fields=nextPageToken%2C files(id%2C createdTime%2C thumbnailLink)&spaces=drive&corpora=user
  * MEMO: caching downloaded images to be generated into a GIF
  * MEMO: URL pattern -> https://www.googleapis.com/drive/v3/files/1zVPSqL2MjmXsIyearJK4L66kuKgz5hPT?alt=media
  */
  workbox.routing.registerRoute(
    /.*(?:www.googleapis)\.com.*$/,
    new workbox.strategies.NetworkFirst({
      cacheName: CACHES_NAMES.GOOGLE_APIS
    })
  );

  /**
  * MEMO: opaque response
  * MEMO: caching sources of gallery images (thumbnails)
  * MEMO: URL pattern -> https://lh3.googleusercontent.com/2MGOktq7Puhg3T_LoEFKBcE9yKQLsYWluwA3Km912LUXfVhwBvCOQO_v6-ZQO0JCyLiTgGXwVIw=s220
  */
  workbox.routing.registerRoute(
    /.*(?:lh3.googleusercontent)\.com.*$/,
    new workbox.strategies.NetworkFirst({
      cacheName: CACHES_NAMES.THUMBNAIL_LINKS,
      plugins: [cacheOpaqueResponsesPlugin]
    })
  );

  /**
  * MEMO: opaque response
  * MEMO: caching sources of gallery images (full sizes)
  * MEMO: URL pattern -> https://drive.google.com/uc?id=1zVPSqL2MjmXsIyearJK4L66kuKgz5hPT&export=download
  */
  workbox.routing.registerRoute(
    /.*(?:drive.google)\.com.*$/,
    new workbox.strategies.NetworkFirst({
      cacheName: CACHES_NAMES.FULLSIZE_LINKS,
      plugins: [cacheOpaqueResponsesPlugin]
    })
  );
  ```

- POST method

  * How to upload a captured image while offline using background sync (potential TODO)

    This will be a problem we should dig into when we want to implement uploading a photo while offline using background sync. It's beyond discussion for now.
