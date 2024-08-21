FROM node:21

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY init.js . 

CMD ["node", "init.js"]