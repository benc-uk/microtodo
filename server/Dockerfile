#
# Build the Vue app as a standalone container 
# Serve as static files using Node/Express without the API
#

# Build and bundle the Vue.js app with Vue CLI 3 https://cli.vuejs.org/
FROM node:10.15.3-alpine as spabuild
WORKDIR /build
COPY vue/package*.json ./
RUN npm install --silent
COPY vue/public ./public
COPY vue/src ./src
COPY vue/.env.production .
COPY vue/.eslintrc.js .
RUN npm run build

# ===================================================================== #

# Integrate the bundled output with a simple Node.js Express server
FROM node:10.15.3-alpine
WORKDIR /app
EXPOSE 8000
COPY server/package*.json ./
RUN npm install
COPY server/server.js .
COPY --from=spabuild /build/dist .
ENTRYPOINT ["npm", "run", "start"]
