# Use a specific Node.js version
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

# Generate Prisma Client
RUN npx prisma generate

# Run the Yarn build script (adjust this based on your project's structure)
RUN yarn build

# Expose the port your app is running on
EXPOSE 4007

# Set environment variables
ARG ORDER_DATABASE_URL
ARG CART_SERVICE_URL
ARG EMAIL_SERVICE_URL
ARG PRODUCT_SERVICE_URL
ARG QUEUE_URL
ENV ORDER_DATABASE_URL=$ORDER_DATABASE_URL
ENV CART_SERVICE_URL=$CART_SERVICE_URL
ENV EMAIL_SERVICE_URL=$EMAIL_SERVICE_URL
ENV PRODUCT_SERVICE_URL=$PRODUCT_SERVICE_URL
ENV RABBITMQ_URL=$RABBITMQ_URL

# Command to run your application in production mode
CMD ["yarn", "start"]
