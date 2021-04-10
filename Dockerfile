FROM node:10-alpine

WORKDIR /app

COPY . .

EXPOSE 6001

RUN npm install

CMD ["npm", "start"]
