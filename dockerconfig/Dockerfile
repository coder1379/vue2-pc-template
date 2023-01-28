FROM nginx:latest

COPY dist /usr/share/nginx/html/

COPY static_file.txt /usr/share/nginx/html

COPY dockerconfig/default.conf /etc/nginx/conf.d/default.conf
