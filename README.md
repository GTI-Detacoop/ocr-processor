# OCR Processor

Servicio de procesamiento OCR construido con NestJS.

## Requisitos

- Docker
- Docker Compose

## Configuración del Entorno

### Desarrollo

Para ejecutar la aplicación en modo desarrollo con hot-reload:

```bash
docker compose up dev
```

La aplicación estará disponible en `http://localhost:3002` y se actualizará automáticamente cuando hagas cambios en el código.

### Producción

Para ejecutar la aplicación en modo producción:

```bash
docker compose up
```

La aplicación estará disponible en `http://localhost` (puerto 80 por defecto).

## Características

- Servidor NestJS
- Configuración Docker optimizada para desarrollo y producción
- Hot-reload en desarrollo
- Construcción multi-etapa para optimizar el tamaño de la imagen

## Estructura del Proyecto

```
.
├── src/                # Código fuente
├── test/              # Archivos de prueba
├── Dockerfile         # Configuración de Docker
├── docker-compose.yml # Configuración de Docker Compose
└── package.json       # Dependencias y scripts
```

## Scripts Disponibles

- `npm run build`: Compila la aplicación
- `npm run start`: Inicia la aplicación
- `npm run start:dev`: Inicia la aplicación en modo desarrollo
- `npm run test`: Ejecuta las pruebas
- `npm run lint`: Ejecuta el linter

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup local

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

