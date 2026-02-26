const CACHE_NAME = 'ciphershare';
const ASSETS = [
    'index.html',
    'manifest.json',
    'CipherShare-logo.png'
];

// Map to store active stream controllers
const streamMap = new Map();

self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    // Ensure the SW takes control of the page immediately
    event.waitUntil(clients.claim());
});



self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Intercept the virtual download URL
    if (url.href.includes('download-p2p/')) {
        const fileName = decodeURIComponent(url.pathname.split('/').pop());
        const streamData = streamMap.get(fileName);

        if (streamData) {
            // Clean up the map after retrieval to prevent memory leaks
            streamMap.delete(fileName);

            const headers = new Headers({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
                'Content-Length': streamData.size, // Provides a progress bar in the browser UI
                'Cache-Control': 'no-cache',
                'X-Content-Type-Options': 'nosniff'
            });

            // Return the stream as a standard HTTP Response
            event.respondWith(new Response(streamData.stream, { headers }));
        } else {
            // If the user refreshes or the map is cleared, return 404
            event.respondWith(new Response("Stream expired or not found. Please restart transfer.", { status: 404 }));
        }
    } else {
        // Standard cache-first strategy for app assets
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

self.onmessage = (event) => {
    if (event.data.type === 'INITIALIZE_STREAM') {
        const { fileName, fileSize, readableStream } = event.data;

        // Store the stream and size for the fetch event to pick up
        streamMap.set(fileName, { 
            stream: readableStream, 
            size: fileSize 
        });

        // Acknowledge the main thread
        if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ status: 'READY' });
        }
    }
};

