FROM python:3.6.5-alpine3.7

ARG env
ENV ENV ${env:-dev}

ARG requirement_file
ENV REQUIREMENT_FILE ${requirement_file:-dev.pip}

RUN apk update
RUN apk add --upgrade --no-cache "postgresql-client" "postgresql-contrib" "postgresql-dev" bash curl
RUN apk add --upgrade --no-cache g++ linux-headers gcc make libffi-dev git wget jpeg-dev zlib-dev libpng-dev graphviz-dev

# Install Python tools
RUN pip install --upgrade \
    virtualenv \
    fabric \
    pip \
    wheel \
    --trusted-host pypi.python.org

# http://gis.stackexchange.com/a/74060
ENV CPLUS_INCLUDE_PATH /usr/include/gdal
ENV C_INCLUDE_PATH /usr/include/gdal

ADD ./requirements/* /tmp/

# Install PyPi dependencies
WORKDIR /tmp
RUN pip install -r $REQUIREMENT_FILE --trusted-host pypi.python.org

ADD . /code/

RUN mkdir -p /data/unpp_api/logs
RUN mkdir -p /data/staticserve
RUN mkdir -p /data/uploads
RUN touch /data/unpp_api/logs/django.log

RUN chmod -R a+rw /data

ENV PYTHONUNBUFFERED 1
WORKDIR /code/

COPY waitforit /usr/local/bin/waitforit
RUN chmod +x /usr/local/bin/waitforit

EXPOSE 8000
