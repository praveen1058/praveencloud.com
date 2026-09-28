FROM node:22-alpine

WORKDIR /app

# Dependencies are installed in their own layer so editing source doesn't reinstall.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

# --host 0.0.0.0 is required: Vite binds to localhost by default, which inside a
# container is unreachable from the host.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
