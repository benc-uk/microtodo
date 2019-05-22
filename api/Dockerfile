#
# Build the API as a standalone container
# Using json-server
#

FROM node:10.15.3-alpine
WORKDIR /app
EXPOSE 8001
COPY api/package*.json ./
RUN npm install
COPY api/db.empty.json ./db.json
COPY api/routes.json .
ENTRYPOINT [ "./node_modules/.bin/json-server", "--host", "0.0.0.0", "--port", "8001", \
             "--routes", "routes.json", "db.json" ]
