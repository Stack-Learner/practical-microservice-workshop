# Use a lightweight Node.js base image suitable for production
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the package.json and yarn.lock files first to leverage Docker cache
COPY package.json yarn.lock ./

# Cache Node modules
RUN yarn install --frozen-lockfile

# Install TypeScript globally
RUN yarn global add typescript

# Copy the rest of the application code to the working directory
COPY . .

# Run the Yarn build script (adjust this based on your project's structure)
RUN yarn build

# Expose the port your app is running on
EXPOSE 4004

# Set environment variables
ARG REDIS_HOST
ARG REDIS_PORT
ARG CART_TTL
ARG INVENTORY_SERVICE
ARG RABBITMQ_URL
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV CART_TTL=$CART_TTL
ENV INVENTORY_SERVICE=$INVENTORY_SERVICE
ENV RABBITMQ_URL=$RABBITMQ_URL

# Command to run your application in production mode
CMD ["yarn", "start"]
