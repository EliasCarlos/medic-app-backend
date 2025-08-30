FROM node:20.11.1-alpine

WORKDIR /app

COPY package*.json yarn.lock ./
COPY prisma ./prisma
RUN yarn install

COPY . .

RUN yarn prisma generate


EXPOSE 5000

CMD ["yarn", "start:dev"]
