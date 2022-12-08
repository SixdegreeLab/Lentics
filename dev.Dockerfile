FROM node:16-alpine

ENV NODE_ENV development

#add turborepo
#RUN yarn set version latest
# RUN yarn global add turbo@1.5.5
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
apk add --no-cache libc6-compat git && \
yarn global add turbo

# Set working directory
WORKDIR /app

# Install app dependencies
#COPY  ["yarn.lock", "package.json", "./"] 

# Copy source files
COPY . .

# Install app dependencies.
# To avoid build failures, please stash the changes for package.json before build new container.
# RUN yarn config set yarn-offline-mirror /app/npm-packages-offline-cache
RUN yarn install --offline

EXPOSE 3000 3001

#CMD ["yarn", "dev"]
CMD ["./bin/start"]
# CMD ["tail", "-f", "/dev/null"]
