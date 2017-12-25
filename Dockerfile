FROM node:alpine
MAINTAINER "Desyllas Dimitrios"

ENV NEO4J_HOST=""
ENV  NEO4J_USER=""
ENV  NEO4J_PASSWORD=""
ENV  MONGO_CONNECTION_STRING=""
ENV  LOGS_DIR="/var/log/data_map"

COPY ./src /opt/map/src
COPY ./www /opt/map/www
COPY ./package.json /opt/map

RUN mkdir -p /var/log/data_map &&\
    chmod 0666 /var/log/data_map &&\
    ls -l /opt/map/src/server.js &&\
    cd /opt/map &&\
    chmod -R +x /opt/map/src &&\
    npm install

WORKDIR /opt/map/src

EXPOSE 7474
VOLUME /var/log/data_map

ENTRYPOINT ["npm", "start"]
