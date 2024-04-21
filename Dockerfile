FROM node:slim
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENTRYPOINT ["node", "/index.js"]
