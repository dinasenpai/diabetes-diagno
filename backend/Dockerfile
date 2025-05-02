# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the backend API on port 5000
EXPOSE 5000

# Run the backend server (replace server.js with your entry point if necessary)
CMD ["npm", "run", "dev"]
