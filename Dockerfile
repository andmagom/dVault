FROM node:10
ENV NODE_ENV=production
WORKDIR /usr/src/app
VOLUME [ "/usr/src/app/data" ]
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8686
CMD ["npm", "start"]
