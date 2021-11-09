FROM node:16.13.0-alpine
MAINTAINER "contact@koumoul.com"

ENV NODE_ENV production

RUN apk add --no-cache curl

# Installing dependencies in webapp directory
WORKDIR /webapp
ADD LICENSE .
ADD .yarnrc.yml .
ADD package.json .
ADD yarn.lock .
# adding yarn cache takes a bit of space but speeds up build, remove this line to inverse the trade-off
# in following versions of the stack we will use the yarn pnp option to prevent creating the node_modules directory
ADD .yarn .yarn
RUN yarn
ADD nodemon.json .

# Adding UI files
ADD public public
ADD nuxt.config.js .
ADD config config
ADD contract contract
RUN yarn run build

# Adding server files
ADD server server
ADD README.md VERSION.json* .

# Default port of our webapps
EXPOSE 8080

# Check the HTTP server is started as health indicator
HEALTHCHECK --start-period=4m --interval=10s --timeout=3s CMD curl -f http://localhost:8080/ || exit 1

CMD ["node", "--max-http-header-size", "64000", "server"]
