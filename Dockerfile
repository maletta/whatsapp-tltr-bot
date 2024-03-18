# Escolha uma imagem base do Node.js
FROM node:20

# Atualize o sistema e instale os pacotes necessários
RUN apt-get update && apt-get install -y \
  gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
  libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
  libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget tzdata

# Configurar o fuso horário para Brasília, Brasil
RUN ln -snf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && echo America/Sao_Paulo > /etc/timezone


# Crie um usuário não-root e use-o
# RUN useradd -m myuser
# USER myuser


# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./
COPY *.json ./
# Copiando arquivos necessários para compilação
COPY src/ src/
COPY .env .env

# Instale as dependências do projeto
RUN npm install

# Execute o script de build
RUN npm run build

# Exponha a porta que seu app usa
EXPOSE 3000

# Comando para iniciar o seu app
# CMD [ "npm", "start" ]