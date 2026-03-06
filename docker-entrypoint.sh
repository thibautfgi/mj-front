#!/bin/sh
# Génère /usr/share/nginx/html/env.js avec les variables d'environnement Render au démarrage

cat > /usr/share/nginx/html/env.js << EOF
window.__env = window.__env || {};
window.__env.authApiUrl = '${MJ_AUTH_API_URL:-http://localhost:8081}';
window.__env.moteurApiUrl = '${MJ_MOTEUR_API_URL:-http://localhost:8080}';
window.__env.mapboxToken = '${MAPBOX_TOKEN_PUBLIC:-}';
EOF

echo "env.js généré :"
cat /usr/share/nginx/html/env.js

# Démarrage de Nginx
exec nginx -g 'daemon off;'

