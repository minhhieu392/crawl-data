FROM node:15.10.0
ENV TZ=Asia/Ho_Chi_Minh
ENV NODE_OPTIONS="--max-old-space-size=4096"
ARG node_env=development

WORKDIR /usr/src/app
# ENV CHROME_BIN=/usr/bin/chromium-browser \
#    CHROME_PATH=/usr/lib/chromium/

# Autorun chrome headless
# ENTRYPOINT ["chromium-browser", "--headless", "--use-gl=swiftshader", "--disable-software-rasterizer", "--disable-dev-shm-usage"]
# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@7.17.0 -g
RUN npm install -g puppeteer --unsafe-perm=true
RUN apt-get update \
    && apt-get install -y gconf-service libasound2 libappindicator3-1 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev libatk-bridge2.0-0 \
    && npm install --global --unsafe-perm puppeteer
COPY package*.json ./


RUN npm install && npm cache clean --force

COPY . .

RUN if [ "${node_env}" = "production" ]; then npm run build; fi
CMD ["npm", "run", "dev"]