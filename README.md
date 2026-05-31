# Cashi API

API REST para gestionar categorías, transacciones, autenticación de usuarios y comprobantes.

## Tecnologías

* Node.js
* TypeScript
* Hono
* Prisma
* PostgreSQL
* Docker Compose
* JWT
* bcryptjs
* Zod
* Bruno

## Instalación

```bash
npm install
```

## Configuración y ejecución

Para ejecutar el proyecto es necesario crear un archivo `.env` en la raíz con las variables de entorno correspondientes. La conexión a la base de datos se configura mediante `DATABASE_URL`, mientras que la firma de los tokens JWT utiliza la variable `JWT_SECRET`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cashi"
JWT_SECRET="dev_secret"
```

La base de datos PostgreSQL se ejecuta mediante Docker Compose. Para iniciarla se debe ejecutar:

```bash
docker compose up -d
```

Una vez levantado el contenedor, se deben aplicar las migraciones de Prisma con:

```bash
npx prisma migrate dev
```

Finalmente, el servidor se inicia mediante:

```bash
npm run dev
```

La API quedará disponible en:

```txt
http://localhost:3000
```

## Autenticación

La API incorpora autenticación basada en JWT. Los usuarios pueden registrarse mediante el endpoint `POST /auth/register`, enviando un correo electrónico y una contraseña.

Ejemplo:

```json
{
  "email": "gabo@test.com",
  "password": "123456"
}
```

Posteriormente pueden autenticarse utilizando `POST /auth/login` con las mismas credenciales.

```json
{
  "email": "gabo@test.com",
  "password": "123456"
}
```

Como respuesta, el sistema genera un token JWT que debe enviarse en todas las rutas protegidas utilizando el encabezado:

```txt
Authorization: Bearer TOKEN
```

## Endpoints principales

La API dispone de endpoints para la administración de categorías y transacciones.

### Categorías

* GET /categories
* POST /categories
* PATCH /categories/:id
* DELETE /categories/:id

### Transacciones

* GET /transactions
* GET /transactions/:id
* POST /transactions
* PATCH /transactions/:id
* DELETE /transactions/:id
* GET /transactions/balance

Las transacciones están asociadas al usuario autenticado. El identificador del usuario no se envía desde el cliente, sino que se obtiene directamente desde el token JWT validado por el middleware de autenticación.

## Carga de comprobantes

El sistema permite adjuntar comprobantes mediante el endpoint:

```txt
POST /transactions/upload
```

La solicitud debe enviarse utilizando el formato `multipart/form-data` e incluir un archivo en el campo `receipt`.

Se aceptan únicamente archivos:

* JPEG
* PNG
* WebP

El tamaño máximo permitido es de 5 MB.

La respuesta entrega una URL local del archivo almacenado:

```json
{
  "receiptUrl": "/uploads/nombre-del-archivo.jpg"
}
```

Los comprobantes se almacenan localmente en la carpeta `uploads/`. En un entorno productivo se recomienda utilizar un servicio especializado de almacenamiento de objetos como Cloudflare R2 o Amazon S3.

## Arquitectura

El proyecto utiliza una arquitectura por capas organizada de la siguiente forma:

```txt
routes -> controllers -> repositories -> schemas
```

Las rutas definen los endpoints expuestos por la API. Los controladores contienen la lógica de negocio y las validaciones de ownership. Los repositorios encapsulan el acceso a datos utilizando Prisma. Los esquemas validan la información de entrada mediante Zod. Los middlewares gestionan funcionalidades transversales como la autenticación JWT.

## Seguridad

Las contraseñas se almacenan utilizando bcrypt para evitar guardar información sensible en texto plano. El sistema utiliza JWT para autenticar usuarios y proteger los endpoints privados. Todas las rutas protegidas requieren el encabezado `Authorization: Bearer TOKEN`.

Además, se implementó validación de ownership para garantizar que un usuario solo pueda visualizar, modificar o eliminar sus propias transacciones. Cuando una transacción pertenece a otro usuario, la API responde con un código `403 Forbidden`.

## Uso de Inteligencia Artificial

Durante el desarrollo del proyecto se utilizó ChatGPT como herramienta de apoyo para comprender la estructura de la aplicación, implementar autenticación con JWT, revisar validaciones de ownership, desarrollar la funcionalidad de carga de comprobantes, preparar la documentación y realizar pruebas mediante Bruno.

Todo el código generado fue revisado, adaptado y probado manualmente antes de ser incorporado al proyecto.
