#
# ==== COMBINED SINGLE CONTAINER ====
#
# Build the Vue App + API as *combined single container*
# Using json-server to serve BOTH the API and the static Vue.js app
#

# Build and bundle the Vue.js app with Vue CLI 3 https://cli.vuejs.org/
FROM node:10-alpine as spabuild
WORKDIR /build
COPY vue/package*.json ./
RUN npm install --silent
COPY vue/public ./public
COPY vue/src ./src
COPY vue/.env.production .
COPY vue/.eslintrc.js .
RUN npm run build

# ===================================================================== #

# Set up container to run JSON Server
# Also have it serve the static bundled Vue.js SPA from the public dir
FROM node:10-alpine
WORKDIR /app
EXPOSE 8000
COPY api/package*.json ./
RUN npm install
COPY api/db.empty.json ./db.json
COPY api/routes.json .
COPY --from=spabuild /build/dist ./public/
ENTRYPOINT [ "./node_modules/.bin/json-server", "--host", "0.0.0.0", "--port", "8000", \
             "--routes", "routes.json", "--static", "./public/", "db.json" ]