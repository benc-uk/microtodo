FROM node:lts-alpine
WORKDIR /app
EXPOSE 3000
ADD api/package.json .
RUN npm install
ADD api/db.empty.json ./db.json
ENTRYPOINT ["npm", "run", "start"]
