# ETAPA 1: Build
FROM node:20-alpine AS build
WORKDIR /rdam-front

# Basado en tu imagen, el package.json está en rdam-front
COPY rdam-front/package*.json ./
RUN npm install
RUN npm install axios

COPY rdam-front/ ./
# Exponemos el puerto de Vite
EXPOSE 5173

# El comando TIENE que ser exactamente este:
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]