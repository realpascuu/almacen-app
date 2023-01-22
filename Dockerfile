FROM node:18

WORKDIR /app/

#ENV PATH /app/node_modules/.bin:$PATH
ENV PATH="/usr/src/app/node_module/.bin:${PATH}"

COPY package*.json /app/
#COPY package*.json ./
#COPY package-lock.json ./

RUN npm install

COPY ./ ./
COPY ./public /app/public
COPY ./src /app/

# install serve
#RUN npm install -g serve

# Build for production.
#RUN npm run build --production

# port
EXPOSE 3000

# ---- RUN APP ----

# develop
CMD ["npm", "run", "serve"]

# production
#CMD serve -s build