FROM node:7.10.1-wheezy

ADD package.json yarn.lock /tmp/

ADD . /code/

WORKDIR /tmp


RUN yarn install

RUN rm -rf /code/node_modules
RUN cp -a /tmp/node_modules /code/node_modules


WORKDIR /code
VOLUME /code

EXPOSE 3000
CMD ["yarn run start"]