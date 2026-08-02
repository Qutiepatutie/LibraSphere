# Use Node version 24
FROM node:24

# Go to frontend roon directory 
WORKDIR /frontend

# Copy dependencies files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the files to the container
COPY . .

# Expose default port for dev
EXPOSE 5173

# Run the app
CMD ["npm", "run", "dev"]
