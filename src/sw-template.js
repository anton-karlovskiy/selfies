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

    // ray test touch <
    /* custom cache rules */
    const CACHE_VERSION = 1;

    // Shorthand identifier mapped to specific versioned cache.
    const CACHES_NAMES = {
      THUMBNAIL_LINKS: `thumbnail-links-${CACHE_VERSION}`,
      GOOGLE_APIS: `google-apis-${CACHE_VERSION}`
    };

    workbox.routing.registerRoute(
      /.*(?:googleapis)\.com.*$/,
      new workbox.strategies.NetworkFirst({
        cacheName: CACHES_NAMES.GOOGLE_APIS
      })
    );
    // ray test touch >

  } else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}
