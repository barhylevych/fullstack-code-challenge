FROM node:slim

ENV NODE_ENV development
ENV PORT=80

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]

EXPOSE $PORT
