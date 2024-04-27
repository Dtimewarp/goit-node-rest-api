FROM node:20.11.1 
WORKDIR /app
COPY . /app
COPY package*.json ./
RUN npm install
CMD ["node", "app.js"]