FROM node:10
ENV NODE_ENV=development
EXPOSE 8080

RUN npm i npm@latest -g
RUN mkdir /opt/node_app && chown node:node /opt/node_app

WORKDIR /opt/node_app
COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

WORKDIR /opt/node_app/app
COPY . .
CMD [ "npm", "start" ]