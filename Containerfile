# FROM nginx:alpine
FROM registry.flyingfishflash.net/docker.io/nginx:alpine
COPY ./container/docker-entrypoint-custom.sh /docker-entrypoint-custom.sh
COPY ./container/lorem-list.nginx.conf.template /etc/nginx/templates/lorem-list.conf.template
RUN rm -rf /usr/share/nginx/html/* && \
rm /etc/nginx/conf.d/default.conf && \
chmod +x /docker-entrypoint-custom.sh
COPY ./dist/lorem-list-client-a/browser/ /usr/share/nginx/html/
ENTRYPOINT ["/docker-entrypoint-custom.sh"]