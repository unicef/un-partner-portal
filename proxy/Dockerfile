FROM nginx:1.15.3

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
    apt-get install -y --no-install-recommends apt-utils && \
    apt-get install --assume-yes python-pip python-dev python-setuptools build-essential cron
RUN pip install j2cli

ADD nginx.conf.j2 /
ADD nginx-site.conf.j2 /
ADD docker-entrypoint.sh /
ADD main.sh /

RUN chmod a+rx /docker-entrypoint.sh
RUN chmod a+rx /main.sh
ENTRYPOINT ["/bin/bash", "/docker-entrypoint.sh"]

EXPOSE 80
EXPOSE 443

CMD ["/main.sh"]
