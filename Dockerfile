FROM node

WORKDIR /app

COPY package.json package-lock.json ./

Run npm install -g npm@7.6.3

RUN npm install -g @angular/cli

RUN npm install --production  

COPY . .

EXPOSE 4200

CMD ng serve --host 0.0.0.0

