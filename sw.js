const CACHE_NAME = 'ciphershare';
const ASSETS = [
    'index.html',
    'manifest.json',
    'CipherShare-logo.png'
];

const streamMap = new Map();

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.includes('/download-p2p/')) {
        const fileName = decodeURIComponent(url.pathname.split('/').pop());
        const streamData = streamMap.get(fileName);

        if (streamData) {
            streamMap.delete(fileName);

            const headers = new Headers({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
                'Cache-Control': 'no-cache',
                'X-Content-Type-Options': 'nosniff'
            });

            event.respondWith(new Response(streamData.stream, { headers }));
        } else {
            event.respondWith(new Response("Stream not initialized", { status: 404 }));
        }
        return;
    }
});

self.onmessage = (event) => {
    if (event.data.type === 'INITIALIZE_STREAM') {
        const { fileName, fileSize, readableStream } = event.data;

        streamMap.set(fileName, { 
            stream: readableStream, 
            size: fileSize 
        });

        if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ status: 'READY' });
        }
    }
};
