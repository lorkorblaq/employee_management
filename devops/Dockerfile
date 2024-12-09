# Use an official Node.js image as the base image
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json from the root directory to the container
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Copy all application files (excluding node_modules using .dockerignore)
COPY ../ ./

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Define the command to run the app
CMD ["node", "server.js"]
