const CACHE_NAME = 'ciphershare';
const ASSETS = ['index.html', 'manifest.json'];
const map = new Map();

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('/download-p2p/')) {
    const fileName = decodeURIComponent(url.pathname.split('/').pop());
    const streamData = map.get(fileName);
    if (streamData) {
      map.delete(fileName);
      e.respondWith(new Response(streamData.stream, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
          'Content-Length': streamData.size
        }
      }));
      return;
    }
  }
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

self.onmessage = (event) => {
  if (event.data.type === 'INITIALIZE_STREAM') {
    const { fileName, fileSize, readableStream } = event.data;
    map.set(fileName, { stream: readableStream, size: fileSize });
    event.ports[0].postMessage({ status: 'READY' });
  }
};