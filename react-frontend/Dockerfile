FROM node:16-alpine as build-step

RUN mkdir -p /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock ./
COPY ./src/ ./src/
COPY ./public/ ./public/
RUN yarn install
RUN yarn build

FROM nginx:stable-alpine

COPY --from=build-step /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY 404.html /usr/share/nginx/html/404.html
COPY 50x.html /usr/share/nginx/html/50x.html

EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
