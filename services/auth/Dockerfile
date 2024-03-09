# Use a lightweight Node.js base image suitable for production
FROM node:20-alpine as production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the package.json and yarn.lock files first to leverage Docker cache
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy the rest of the application code to the working directory
COPY . .

# Run the Yarn build script (adjust this based on your project's structure)
RUN yarn build

# Expose the port your app is running on
EXPOSE 4003

# Set environment variables from .env file
ARG DATABASE_URL
ARG JWT_SECRET
ARG EMAIL_SERVICE_URL
ARG USER_SERVICE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV EMAIL_SERVICE_URL=$EMAIL_SERVICE_URL
ENV USER_SERVICE_URL=$USER_SERVICE_URL

# Command to run your application in production mode
CMD ["yarn", "start"]
