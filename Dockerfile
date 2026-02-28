# Estágio de construção
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar os arquivos e compilar
COPY . .
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Limpar configurações default e de páginas do Nginx
RUN rm -rf /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivo de configuração do Nginx otimizado para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar a pasta do subdiretório e copiar o resultado do build para ela
RUN mkdir -p /usr/share/nginx/html/comunicamais
COPY --from=build /app/dist /usr/share/nginx/html/comunicamais

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
