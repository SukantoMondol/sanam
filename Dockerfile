# Use a Node.js base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm i sharp -f
RUN npm run build -f

# Set the command to start the app
CMD ["npm", "start"]