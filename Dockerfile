FROM node

WORKDIR /app
##COPY package.json ./
#COPY server.js package.json package-lock.json ./
#COPY config ./config
#COPY controllers ./controllers
#COPY middleware ./middleware
#COPY models ./models
#COPY routes ./routes

ADD . .

#COPY server.js ./
RUN npm install

EXPOSE 5001
#CMD npm start
CMD [ "node", "server.js" ]
#CMD tail -f /dev/null
