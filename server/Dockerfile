FROM node:gallium-bullseye

ENV CI=true \
  SKIP_PREFLIGHT_CHECK=true

WORKDIR /src

COPY . .

RUN apt update && apt install -y tor

RUN npm install

EXPOSE 3000

CMD npm run start