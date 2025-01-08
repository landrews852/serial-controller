# Usamos la imagen que trae Wine + electron-builder
FROM electronuserland/builder:wine

# Creamos y cambiamos a la carpeta de trabajo
WORKDIR /app

# Copiamos todo tu proyecto a la imagen
COPY . /app

# Instalamos dependencias
RUN yarn install

# Construimos (React + TypeScript + Electron)
RUN yarn build

# Empaquetamos el .exe usando electron-builder --win
RUN yarn package --win

# Si quieres quedarte con un contenedor “limpio”, elimina los node_modules,
# pero en proyectos con dependencias nativas a veces no conviene.