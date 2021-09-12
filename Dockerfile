FROM alpine AS server
RUN apk add nodejs yarn
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY packages/server/package.json ./packages/server/
RUN yarn --frozen-lockfile
COPY packages/server ./packages/server
RUN yarn build:server
RUN yarn install --production --ignore-scripts --prefer-offline

FROM alpine AS frontend
RUN apk add nodejs yarn
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY packages/frontend/package.json ./packages/frontend/
RUN yarn --frozen-lockfile
COPY packages/frontend ./packages/frontend
RUN yarn build:frontend
RUN yarn install --production --ignore-scripts --prefer-offline

FROM alpine
RUN apk add nodejs yarn
WORKDIR /app
COPY package.json ./
COPY --from=server /app/node_modules ./node_modules
COPY --from=server /app/packages/server/package.json ./packages/server/
COPY --from=server /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=server /app/packages/server/dist ./packages/server/dist
COPY --from=frontend /app/node_modules ./node_modules
COPY --from=frontend /app/packages/frontend/package.json ./packages/frontend/
COPY --from=frontend /app/packages/frontend/node_modules ./packages/frontend/node_modules
COPY --from=frontend /app/packages/frontend/dist ./packages/frontend/dist
ENV NODE_ENV=production
ENV PORT=80
CMD [ "yarn", "start" ]