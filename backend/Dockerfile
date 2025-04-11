FROM node:latest
WORKDIR /backend
COPY package*.json ./
COPY . .

RUN npm install
EXPOSE 5000

CMD ["node", "server.js"]