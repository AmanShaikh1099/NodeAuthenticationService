# 1. Use Node.js as the base image
FROM node:18

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json, then install dependencies
COPY package.json ./
RUN npm install --production

# 4. Copy all the remaining backend files into the container
COPY . .

# 5. Expose the port your Node.js app runs on
EXPOSE 3001

# 6. Start the server
CMD ["node", "src/server.js"]
