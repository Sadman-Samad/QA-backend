# Deploy Express.js with NGINX on a VM (with Comments)

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm
sudo apt install -y nodejs npm
node -v  # check node version
npm -v   # check npm version

# Create project directory
mkdir express-demo
cd express-demo

# Initialize Node.js project
npm init -y  # creates package.json

# Install Express
npm install express

# Create index.js with basic Express server
nano index.js
# Inside index.js:
# const express = require('express');
# const app = express();
# const port = 8081;
# app.get('/', (req, res) => res.send('Hello from Express.js on Google Cloud Shell!'));
# app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

# Run Express app
node index.js
# Test locally
curl http://localhost:8081

# Install NGINX
sudo apt install -y nginx

# Edit NGINX configuration to reverse proxy to Express
sudo nano /etc/nginx/sites-available/default
# Replace the server block with:
# server {
#     listen 80;
#     server_name _;
#     location / {
#         proxy_pass http://localhost:8081;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

# Test NGINX configuration
sudo nginx -t

# Start or reload NGINX
sudo nginx -s reload

# Access your app
# Option 1: Cloud Shell Web Preview (use correct port, e.g., 8081)
# Option 2: VM Public IP if using external VM

# Optional: Use ngrok for temporary public URL
# sudo npm install -g ngrok
# ngrok http 8081

# Troubleshooting tips:
# - Use `sudo lsof -i :PORT` to check for port conflicts
# - NGINX logs: /var/log/nginx/error.log
# - Express logs: console output
