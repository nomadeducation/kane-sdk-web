# Fetch the latest LTS version (don't use the alpine version in dev)
FROM node:8

# Install dependencies
WORKDIR /home/node/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Allow the user to run CMD on the host side that will write content to the WORKDIR
RUN chown -R node:node .

# Run the image as a non-root user
USER node

# Run the app
CMD yarn start:dev
