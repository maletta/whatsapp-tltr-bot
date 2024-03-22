#!/bin/bash

# Path to origin folder
src="./external/whatsapp-web.js"

# Path to destiny folder
dest="./node_modules/whatsapp-web.js"

# Copiar todos os arquivos da pasta de origem para  pasta de destino
cp -R $src/* $dest