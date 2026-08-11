FROM mcr.microsoft.com/playwright:v1.45.0-jammy

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment
ENV CI=true
ENV ENV=staging

# Default command runs smoke tests
CMD ["npm", "run", "test:smoke"]
