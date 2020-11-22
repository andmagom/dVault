### STAGE 1: Build Angular ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY angular/package.json angular/package-lock.json ./
RUN npm install
COPY angular/ .
RUN npm run build

### STAGE 2: Build dVault ###
FROM node:10
ENV NODE_ENV=production
WORKDIR /usr/src/app
VOLUME [ "/usr/src/app/data" ]
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN rm -rf angular
COPY --from=build /usr/src/app/dist/dvault public
EXPOSE 8686
CMD ["npm", "start"]
