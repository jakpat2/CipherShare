const CACHE_NAME = 'ciphershare';
const ASSETS = [
    'index.html',
    'manifest.json',
    'CipherShare-logo.png'
];

// Map to store active stream controllers
const streamMap = new Map();

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.onmessage = (event) => {
    if (event.data.type === 'INITIALIZE_STREAM') {
        const { fileName, fileSize, readableStream } = event.data;
        streamMap.set(fileName, { stream: readableStream, size: fileSize });
        if (event.source) event.source.postMessage({ type: 'STREAM_READY' });
    }
};

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.pathname.includes('/download-p2p/')) {
        const fileName = decodeURIComponent(url.pathname.split('/').pop());
        const data = streamMap.get(fileName);
        if (data) {
            streamMap.delete(fileName);
            const headers = new Headers({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
                'Content-Length': data.size,
                'X-Content-Type-Options': 'nosniff'
            });
            event.respondWith(new Response(data.stream, { headers }));
        }
    }
});
