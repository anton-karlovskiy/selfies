/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if ('function' === typeof importScripts) {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');
    workbox.core.skipWaiting();

    /* injection point for manifest files. */
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

    workbox.precaching.cleanupOutdatedCaches();

    /* custom cache rules */
    const CACHE_VERSION = 1;

    // Shorthand identifier mapped to specific versioned cache.
    const CACHES_NAMES = {
      PRODUCTION: 'PRODUCTION',
      THUMBNAIL_LINKS: `thumbnail-links-${CACHE_VERSION}`,
      FULLSIZE_LINKS: `fullsize-links-${CACHE_VERSION}`,
      GOOGLE_APIS: `google-apis-${CACHE_VERSION}`,
      GAPI: 'GAPI'
    };

    // MEMO: caching routes
    workbox.routing.registerRoute(
      new workbox.routing.NavigationRoute(
        new workbox.strategies.NetworkFirst({
          cacheName: CACHES_NAMES.PRODUCTION
        })
      )
    );

    // MEMO: https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests#force_caching_of_opaque_responses
    const cacheOpaqueResponsesPlugin = new workbox.cacheableResponse.CacheableResponsePlugin({
      statuses: [0, 200]
    });

    /**
     * TODO: 'https://www.googleapis.com/drive/v3/*', is not working -> lack of Regular Expression knowledge
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
  } else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}
