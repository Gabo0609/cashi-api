## Producción

La aplicación fue desplegada en Render como parte de la etapa final del proyecto.

URL pública de producción:

https://cashi-api-03az.onrender.com

El backend se encuentra conectado a una instancia PostgreSQL administrada por Render, permitiendo separar completamente el entorno de producción del entorno de desarrollo local.

Durante el despliegue se configuraron variables de entorno para la conexión a la base de datos, autenticación JWT y acceso a Cloudflare R2. Estas credenciales no se almacenan en el repositorio y son gestionadas directamente por la plataforma de despliegue.

Las migraciones de Prisma fueron aplicadas sobre la base de datos de producción para garantizar que la estructura utilizada en desarrollo y producción sea consistente.

Además, el repositorio GitHub se encuentra conectado a Render, permitiendo realizar despliegues automáticos cada vez que se actualiza la rama principal del proyecto.

## Despliegue y almacenamiento

Para la publicación del proyecto se utilizaron servicios cloud especializados.

### Render

Render fue utilizado para:

* Hospedar la API en producción.
* Ejecutar la aplicación Node.js.
* Administrar la base de datos PostgreSQL de producción.
* Gestionar las variables de entorno necesarias para el funcionamiento de la aplicación.
* Automatizar el proceso de despliegue mediante integración con GitHub.

Gracias a esto la API quedó disponible públicamente mediante una URL accesible desde internet.

### PostgreSQL en la nube

La base de datos utilizada en producción corresponde a una instancia PostgreSQL administrada por Render.

Esta configuración elimina la dependencia de Docker local para el entorno productivo y permite que la información permanezca disponible incluso cuando el servidor es reiniciado o redeployado.

### Cloudflare R2

Los comprobantes asociados a las transacciones se almacenan en Cloudflare R2 mediante almacenamiento de objetos compatible con Amazon S3.

Se creó un bucket denominado:

cashi-receipts

Cuando un usuario carga una imagen mediante el endpoint:

POST /transactions/upload

el archivo es enviado a Cloudflare R2 y posteriormente se devuelve una URL pública que puede asociarse a una transacción.

Esta estrategia evita almacenar archivos dentro del servidor de aplicación y permite conservar los comprobantes incluso cuando la aplicación es desplegada nuevamente.

### Flujo de almacenamiento de comprobantes

1. El usuario envía una imagen mediante multipart/form-data.
2. La API valida tipo y tamaño del archivo.
3. El archivo es almacenado en Cloudflare R2.
4. Se genera una URL pública.
5. La URL es almacenada posteriormente junto a la transacción correspondiente.

De esta manera los comprobantes permanecen disponibles independientemente del ciclo de vida del servidor donde se ejecuta la API.
