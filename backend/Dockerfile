FROM node:8.11.2
RUN npm rebuild
RUN mkdir /var/www
WORKDIR /var/www
ADD . /var/www
ENTRYPOINT ["/bin/bash", "start.sh"]