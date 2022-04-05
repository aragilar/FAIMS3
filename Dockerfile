#https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

FROM node:lts-alpine3.14@sha256:131c9f58255a7d9c38f194664c4c63a4c5ca4deff644e9be142b8ab4903d48de as build
ARG REACT_APP_COMMIT_VERSION
ARG REACT_APP_DIRECTORY_HOST
ARG REACT_APP_SERVICES
ARG REACT_APP_SERVER
ARG REACT_APP_PRODUCTION_BUILD
ARG REACT_APP_USE_REAL_DATA
ARG REACT_APP_TAG
ARG REACT_APP_POUCH_BATCHES_LIMIT
ARG REACT_APP_POUCH_BATCH_SIZE
RUN apk --no-cache add python3=~3.9 make=~4.3 g++=~10.3

# we need as build due to line 22

# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
WORKDIR /app
COPY --chown=node:node ./ /app/
RUN npm ci
#COPY --chown=node:node package*.json /app/


# https://github.com/FAIMS/FAIMS3/wiki/building-the-webapp
ENV NODE_ENV production
#ENV REACT_APP_COMMIT_VERSION $REACT_APP_COMMIT_VERSION
#RUN sh /app/bin/setVersionExport.sh
ENV REACT_APP_PRODUCTION_BUILD true
ENV REACT_APP_USE_REAL_DATA false
#REACT_APP_USE_REAL_DATA: This configures whether to include local test data in the system or not. REACT_APP_USE_REAL_DATA=true disables test data.
ENV REACT_APP_USE_HTTPS true
#ENV REACT_APP_DIRECTORY_HOST $REACT_APP_DIRECTORY_HOST
ENV REACT_APP_DIRECTORY_PORT 443
# https://blog.knoldus.com/deployment-with-docker-in-ionic/
#USER node
# They say to run with min privs, but since we're building and not running, I CBF'd right now.
RUN npm run-script build

FROM nginx:mainline-alpine@sha256:da9c94bec1da829ebd52431a84502ec471c8e548ffb2cedbf36260fd9bd1d4d3
RUN rm -rf /usr/share/nginx/html/*
# not /app/www but /app/build because react
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build/ /usr/share/nginx/html/
