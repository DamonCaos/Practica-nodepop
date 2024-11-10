# Nodepop

**Nodepop** es un proyecto de práctica para la gestión de productos, usuarios y autenticación. Permite a los usuarios registrar sus datos, iniciar sesión y gestionar productos mediante operaciones CRUD. La aplicación utiliza **Node.js** con **Express** y una base de datos **MongoDB**. La autenticación de usuarios se maneja de forma segura utilizando **bcrypt** para la encriptación de contraseñas.

## Tecnologías utilizadas

- **Node.js**: Para la ejecución del servidor.
- **Express**: Framework para gestionar las rutas y solicitudes HTTP.
- **MongoDB**: Base de datos NoSQL para almacenar los datos de los usuarios y productos.
- **bcrypt**: Para la encriptación y comparación segura de contraseñas.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB, utilizado para interactuar con la base de datos.
- **Session**: Para manejar la sesión del usuario y mantenerlo autenticado.

## Requisitos previos

Asegúrate de tener los siguientes elementos instalados:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) (o usa MongoDB Atlas para una base de datos en la nube).

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/DamonCaos/Practica-nodepop.git

2. Navega a la carpeta del proyecto:
    ```bash
    cd NodePop/nodepop

3. Instala las dependencias:
    ```
    npm install
    ```
4. Crea un archivo .env en la raíz del proyecto y configura las variables de entorno:
```
    DB_URI=mongodb://localhost:27017/nodepop
SESSION_SECRET=tu_secreto_de_sesion
```
5. Inicia la aplicacion:
```
npm start
```
O pra desarrollo ( con nodemon)
```
npm run dev
```
6. Abre tu navegador y accede a http://localhost:3000.

## Funcionalidades

Registro de usuarios: Permite a los usuarios registrarse con su email y contraseña. Las contraseñas son encriptadas antes de almacenarse en la base de datos.
Autenticación: Los usuarios pueden iniciar sesión con su email y contraseña. Se valida la contraseña usando bcrypt.
Gestión de productos: Los usuarios autenticados pueden agregar, editar y eliminar productos.
Rutas protegidas: Solo los usuarios autenticados pueden acceder a las rutas para gestionar productos.

## Rutas principales
GET /login: Muestra el formulario de inicio de sesión.
POST /login: Procesa el inicio de sesión de un usuario.
GET /register: Muestra el formulario de registro.
POST /register: Procesa el registro de un nuevo usuario.
GET /products: Muestra los productos disponibles.
POST /products: Permite a los usuarios agregar un nuevo producto (requiere autenticación).
PUT /products/:id: Permite a los usuarios editar un producto (requiere autenticación).
DELETE /products/:id: Permite a los usuarios eliminar un producto (requiere autenticación).

## Contribuciones
si deseas contribuir al proyecto:
1. Haz un fork de este repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
3. Realiza tus cambios.
4. Haz commit de tus cambios (git commit -am 'Añadí una nueva funcionalidad').
5. Haz push a la rama (git push origin feature/nueva-funcionalidad).
6. Abre un pull request.