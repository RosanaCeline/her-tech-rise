# Etapa 1: build do frontend usando Node
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências (cache)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o restante do projeto
COPY . .

# Build do frontend, respeitando base '/hertechrise/'
RUN npm run build

# Etapa 2: Serve o build com Nginx
FROM nginx:alpine

# Remove configuração default do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copia os arquivos buildados para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expondo a porta 80
EXPOSE 80

# Inicia o Nginx em foreground
CMD ["nginx", "-g", "daemon off;"]
