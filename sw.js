const CACHE_NAME = 'ciphershare';
const ASSETS = [
    'index.html',
    'manifest.json',
    'CipherShare-logo.png'
];

// Map to store active stream controllers and metadata
const streams = new Map();
const controllers = new Map();

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('message', (event) => {
    const { type, fileName, fileSize, realName, chunk } = event.data;

    if (type === 'INITIALIZE_STREAM') {
        const stream = new ReadableStream({
            start(controller) {
                controllers.set(fileName, controller);
            }
        });
        streams.set(fileName, { stream, size: fileSize, realName });
        
        event.source.postMessage({ type: 'SW_READY', fileName });
    }

    if (type === 'STREAM_CHUNK') {
        const controller = controllers.get(fileName);
        if (controller) {
            controller.enqueue(chunk);
        }
    }

    if (type === 'CLOSE_STREAM') {
        const controller = controllers.get(fileName);
        if (controller) {
            controller.close();
            controllers.delete(fileName);
            streams.delete(fileName); 
        }
    }
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    if (url.pathname.includes('download-p2p')) {
        const segments = url.pathname.split('/');
        const streamId = segments[segments.length - 1];
        const data = streams.get(streamId);

        if (data) {
            // Log for debugging
            console.log("SW: Intercepting download for", data.realName);

            const headers = new Headers({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${data.realName}"`,
                'Content-Length': data.size,
                // Critical: prevent browser from timing out or "guessing" the content
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'X-Content-Type-Options': 'nosniff'
            });

            event.respondWith(new Response(data.stream, { headers }));
        } else {
            console.warn("SW: Stream ID not found", streamId);
            event.respondWith(new Response('Stream not found', { status: 404 }));
        }
    }
});
