// ============================================================
// A2M System — Service Worker
// Necessário para o navegador permitir "Instalar como app".
//
// Estratégia: NETWORK-FIRST.
// O sistema é atualizado com frequência no GitHub Pages, então
// a rede sempre tem prioridade. O cache só entra em ação quando
// o técnico está sem internet — assim ninguém fica preso a uma
// versão antiga depois de um deploy.
// ============================================================

const CACHE = 'a2m-v1';

// Instala e assume o controle imediatamente (sem esperar abas antigas fecharem)
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(
        nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

// Handler de fetch — exigido pelo navegador para considerar o site instalável
self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Só trata navegação e GET do próprio site.
  // Chamadas ao Supabase, CDNs e APIs passam direto, sem cache.
  if (req.method !== 'GET') return;
  if (!req.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(req)
      .then((resp) => {
        // Guarda uma cópia para uso offline
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {});
        return resp;
      })
      .catch(() =>
        // Sem internet: devolve o que tiver em cache
        caches.match(req).then((r) => r || caches.match('./index.html'))
      )
  );
});
