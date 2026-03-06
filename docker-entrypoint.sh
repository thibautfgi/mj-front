#!/bin/sh
# Génère /usr/share/nginx/html/env.js avec les variables d'environnement Render au démarrage
# Render injecte le host sans schéma (ex: mj-auth.onrender.com), on préfixe https:// si besoin

add_scheme() {
  val="$1"
  default="$2"
  if [ -z "$val" ]; then
    echo "$default"
  elif echo "$val" | grep -q "^http"; then
    echo "$val"
  else
    echo "https://$val"
  fi
}

AUTH_URL=$(add_scheme "${MJ_AUTH_API_URL}" "http://localhost:8081")
MOTEUR_URL=$(add_scheme "${MJ_MOTEUR_API_URL}" "http://localhost:8080")

cat > /usr/share/nginx/html/env.js << EOF
window.__env = window.__env || {};
window.__env.authApiUrl = '${AUTH_URL}';
window.__env.moteurApiUrl = '${MOTEUR_URL}';
window.__env.mapboxToken = '${MAPBOX_TOKEN_PUBLIC:-}';
EOF

echo "env.js généré :"
cat /usr/share/nginx/html/env.js

# Démarrage de Nginx
exec nginx -g 'daemon off;'

