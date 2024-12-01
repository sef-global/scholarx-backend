# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the Docker container to /app
WORKDIR /app/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app source inside the Docker image 
# (assuming your app is in the "src" directory of your project)
COPY . .

# Copy the init-db.sh script to the working directory
COPY init-db.sh /app/src/init-db.sh

# Make the init-db.sh script executable
RUN chmod +x /app/src/init-db.sh
# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the app when the container launches

CMD [ "sh", "init-db.sh"]
