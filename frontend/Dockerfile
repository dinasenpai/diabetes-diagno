# Use Node.js as base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend source code
COPY . .

# Build the application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]