# 制作构建镜像
FROM nginx
# 调整时区，升级软件包
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 引入nginx配置
COPY nginx.conf /etc/nginx/
# 引入构建文件
COPY ./dist/web/browser /usr/share/nginx/html