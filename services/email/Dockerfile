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

# Generate Prisma Client
RUN npx prisma generate

# Run the Yarn build script (adjust this based on your project's structure)
RUN yarn build

# Expose the port your app is running on
EXPOSE 4005

# Set environment variables from .env file
ARG DATABASE_URL
ARG SMTP_HOST
ARG SMTP_PORT
ARG DEFAULT_SENDER_EMAIL
ARG RABBITMQ_URL
ENV DATABASE_URL=$DATABASE_URL
ENV SMTP_HOST=$SMTP_HOST
ENV SMTP_PORT=$SMTP_PORT
ENV DEFAULT_SENDER_EMAIL=$DEFAULT_SENDER_EMAIL
ENV RABBITMQ_URL=$RABBITMQ_URL

# Command to run your application in production mode
CMD ["yarn", "start"]
