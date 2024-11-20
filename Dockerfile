############################################################################################################
# Stage: prepare a base image with all native utils pre-installed, used both by builder and definitive image
FROM node:20.18.0-alpine3.20 AS nativedeps
RUN apk add --no-cache curl
######################################
FROM nativedeps AS builder
MAINTAINER "contact@koumoul.com"

# Installing clean-modules
RUN npm install --location=global clean-modules@3.0.5

WORKDIR /webapp

# Installing dependencies in webapp directory
COPY LICENSE .
COPY package.json .
COPY package-lock.json .

RUN npm ci && clean-modules --yes "!**/*.eslintrc.json" "!*mocha/lib/test.js" "!**/*.mustache"

# Adding UI files
COPY public public
COPY nuxt.config.js .
COPY config config
COPY contract contract

# Build UI
ENV NODE_ENV production
RUN npm run build

# Adding server files
COPY server server

# Check quality
COPY .eslintignore .eslintignore
COPY .gitignore .gitignore
RUN npm run lint
COPY test test
RUN npm run test
RUN npm audit --omit=dev --audit-level=critical

# Cleanup /webapp/node_modules so it can be copied by next stage
RUN npm prune --production
RUN rm -rf node_modules/.cache

##################################
# Stage: main nodejs service stage
FROM nativedeps
MAINTAINER "contact@koumoul.com"

RUN apk add --no-cache dumb-init

WORKDIR /webapp

# We could copy /webapp whole, but this is better for layering / efficient cache use
COPY --from=builder /webapp/node_modules /webapp/node_modules
COPY --from=builder /webapp/package.json /webapp/package.json
COPY --from=builder /webapp/nuxt-dist /webapp/nuxt-dist
COPY nuxt.config.js nuxt.config.js
COPY server server
COPY config/default.js config/
COPY config/production.js config/
COPY config/custom-environment-variables.js config/
COPY contract contract

# Adding licence, manifests, etc.
COPY README.md BUILD.json* ./
COPY LICENSE .

# Compatibility with OpenShift
RUN chgrp -R 0 . && chmod -R g=u .

# configure node webapp environment
ENV NODE_ENV production

# Default port of our webapps
EXPOSE 8080

# Check the HTTP server is started as health indicator
HEALTHCHECK --start-period=4m --interval=10s --timeout=3s CMD curl -f http://localhost:8080/ || exit 1

CMD ["node", "--max-http-header-size", "64000", "server"]
