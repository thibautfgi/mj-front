// En production, les URLs sont injectées au démarrage du conteneur via docker-entrypoint.sh
// window.__env est défini dans env.js chargé par index.html
declare const window: Window & { __env?: Record<string, string> };

export const environment = {
  production: true,
  authApiUrl: (window.__env?.['authApiUrl']) ?? 'https://mj-auth.onrender.com',
  moteurApiUrl: (window.__env?.['moteurApiUrl']) ?? 'https://mj-moteur.onrender.com',
  MAPBOX_TOKEN_PUBLIC: (window.__env?.['mapboxToken']) ?? ''
};
