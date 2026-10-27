// Service worker F1 Poule: toont pushmeldingen en opent de app bij een tik
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "F1 Poule", {
    body: d.body || "",
    icon: "icon-192-v2.png",
    badge: "icon-192-v2.png",
    data: { url: d.url || "./" },
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || "./", self.registration.scope).href;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if ("focus" in c) {
        try { await c.navigate(url); } catch { /* geen probleem */ }
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
