FROM node:slim

ENV NODE_ENV production
ENV PORT=80

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "start"]

EXPOSE $PORT
