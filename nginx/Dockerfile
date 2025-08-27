# ---- 1. Build Frontend Vendedores ----
FROM node:18-alpine AS build_vendedores
WORKDIR /app
# La ruta ahora es relativa a la raíz del proyecto
COPY ./ruleta-web-vendedores/package*.json ./
RUN npm install
COPY ./ruleta-web-vendedores/ .
COPY ./ruleta-web-vendedores/.env.docker .env
RUN npm run build

# ---- 2. Build Frontend Mostrador ----
FROM node:18-alpine AS build_mostrador
WORKDIR /app
# La ruta ahora es relativa a la raíz del proyecto
COPY ./ruleta-web-mostrador/package*.json ./
RUN npm install
COPY ./ruleta-web-mostrador/ .
COPY ./ruleta-web-mostrador/.env.docker .env
RUN npm run build

# ---- 3. Create Final Nginx Image ----
FROM nginx:alpine
# La ruta ahora debe incluir la carpeta 'nginx'
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Las rutas para copiar los artefactos no cambian
COPY --from=build_vendedores /app/dist /usr/share/nginx/html/vendedores/
COPY --from=build_mostrador /app/dist /usr/share/nginx/html/mostrador/