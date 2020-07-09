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

    // MEMO: caching
    // https://apis.google.com/js/api.js
    // https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.yyhByYeMTAc.O/m=auth2/rt=j/sv=1/d=1/ed=1/am=wQc/rs=AGLTcCN9qAMm_5_ztFCxaPySR5cb8QjKkw/cb=gapi.loaded_0
    workbox.routing.registerRoute(
      /.*(?:apis.google)\.com.*$/,
      new workbox.strategies.NetworkFirst({
        cacheName: CACHES_NAMES.GAPI
      })
    );

    // TODO: 'https://www.googleapis.com/drive/v3/*', is not working -> lack of regular expression knowledge
    // MEMO: caching folder ID and payload data of gallery images
    workbox.routing.registerRoute(
      /.*(?:www.googleapis)\.com.*$/,
      new workbox.strategies.NetworkFirst({
        cacheName: CACHES_NAMES.GOOGLE_APIS
      })
    );

    // MEMO: https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests#force_caching_of_opaque_responses
    const cacheOpaqueResponsesPlugin = new workbox.cacheableResponse.CacheableResponsePlugin({
      statuses: [0, 200]
    });

    const thumbnailsStrategy = new workbox.strategies.NetworkFirst({
      cacheName: CACHES_NAMES.THUMBNAIL_LINKS,
      plugins: [cacheOpaqueResponsesPlugin]
    });

    // MEMO: caching sources of gallery images
    workbox.routing.registerRoute(
      /.*(?:lh3.googleusercontent)\.com.*$/,
      thumbnailsStrategy
    );
  } else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}
