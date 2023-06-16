FROM node:12

RUN mkdir -p /app/views
RUN mkdir -p /app/public
RUN mkdir -p /app/modules
RUN mkdir -p /app/views
WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install -g bower
RUN npm install
RUN bower install

ENV NODE_ENV='Development'
ENV PORT=2014
ENV NODE_TLS_REJECT_UNAUTHORIZED='0'

EXPOSE 2014

CMD [ "node", "app.js" ]
