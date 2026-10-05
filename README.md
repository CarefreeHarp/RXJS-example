# RXJS Example

Proyecto base en Angular 19 standalone, sin routing ni SSR, para el taller de búsqueda de perfiles de una red social.

## Documentación de la API

**[Abrir la documentación oficial de DummyJSON](https://dummyjson.com/docs)**

[DummyJSON](https://dummyjson.com/) proporciona datos de ejemplo para probar aplicaciones. La URL base para las consultas de este taller es `https://dummyjson.com`.

Las interfaces del proyecto se basan en los campos de las respuestas JSON mostradas en la documentación oficial de cada entidad:

| Entidad | Interfaz local | Documentación y ejemplos de respuestas |
| --- | --- | --- |
| Usuario | [User](src/app/models/user.ts) | [Users](https://dummyjson.com/docs/users) |
| Post | [Post](src/app/models/post.ts) | [Posts](https://dummyjson.com/docs/posts) |
| Comentario | [Comment](src/app/models/comment.ts) | [Comments](https://dummyjson.com/docs/comments) |

## Consultas útiles

Todas estas consultas usan el método HTTP `GET`. Las rutas se agregan a la URL base.

| Ruta | Resultado |
| --- | --- |
| `/users` | Lista de usuarios dentro de `users`. |
| `/users/1` | Un usuario como objeto. |
| `/users/filter?key=username&value=emilys` | Usuarios que coinciden con el username, dentro de `users`. |
| `/posts` | Lista de posts dentro de `posts`. |
| `/posts/1` | Un post como objeto. |
| `/posts/user/1` | Posts del usuario con ID 1, dentro de `posts`. |
| `/comments` | Lista de comentarios dentro de `comments`. |
| `/comments/1` | Un comentario como objeto. |
| `/comments/post/2` | Comentarios del post con ID 2, dentro de `comments`. |

Fuentes: [Users](https://dummyjson.com/docs/users), [Posts](https://dummyjson.com/docs/posts) y [Comments](https://dummyjson.com/docs/comments).

## Cómo interpretar las respuestas

Las consultas de listas devuelven un objeto con el arreglo y los campos de paginación `total`, `skip` y `limit`. Por eso el resultado del filtro de usuarios se lee desde `respuesta.users`, aunque solo haya una coincidencia. Los endpoints por ID devuelven directamente el objeto de la entidad. [Documentación de usuarios](https://dummyjson.com/docs/users).

Los listados generales devuelven 30 elementos por defecto. `limit` controla la cantidad, `skip` permite omitir elementos y `limit=0` permite obtener todos. Conviene revisar la paginación para cumplir el requisito de mostrar todos los posts y comentarios. [Posts](https://dummyjson.com/docs/posts), [Comments](https://dummyjson.com/docs/comments).

El filtro usa los parámetros `key` y `value`, que distinguen mayúsculas de minúsculas. `emilys` es el username del ejemplo oficial. [Filtro de usuarios](https://dummyjson.com/docs/users).

## Campos relevantes para el taller

- **User:** `id`, `username`, `firstName`, `lastName`, `image`, `age`, `email` y `phone` permiten identificar y mostrar el perfil. La interfaz también conserva los datos anidados documentados, como `address`, `hair`, `bank`, `company` y `crypto`. [Users](https://dummyjson.com/docs/users).
- **Post:** `id`, `title`, `body`, `tags`, `views` y `userId`. `userId` relaciona el post con el usuario. `reactions` es un objeto con los contadores numéricos `likes` y `dislikes`. [Posts](https://dummyjson.com/docs/posts).
- **Comment:** `id`, `body`, `postId`, `likes` y `user`. `postId` identifica el post comentado; `user` contiene `id`, `username` y `fullName`. Para mostrar el nombre del autor se puede usar `user.fullName`; este objeto es un resumen del autor y no un usuario completo. [Comments](https://dummyjson.com/docs/comments).

Las relaciones se obtienen con consultas separadas: buscar el usuario, consultar sus posts usando su ID y consultar los comentarios de cada post usando el ID del post. Los comentarios no vienen como un arreglo dentro de la entidad `Post`. [Posts](https://dummyjson.com/docs/posts), [Comments](https://dummyjson.com/docs/comments).

## Organización y estado del proyecto

- `src/app/components/search-bar/`: barra de búsqueda.
- `src/app/components/user-details/`: datos del usuario.
- `src/app/components/user-posts/`: posts y comentarios.
- `src/app/models/`: interfaces de las tres entidades.
- `src/app/services/`: `UserService.getByUsername(username)` consulta `/users/filter` con `key=username` y devuelve `Observable<{ users: User[] }>`. El usuario se obtiene de `respuesta.users[0]`, que puede no existir si no hay coincidencias. `PostService.getById(id)` consulta `/posts/{id}` y devuelve `Observable<Post>`. `PostService.getByUserId(userId)` consulta `/posts/user/{userId}` sin parámetros adicionales y devuelve `Observable<{ posts: Post[] }>`. `CommentService.getByPostId(postId)` consulta `/comments/post/{postId}` y devuelve `Observable<{ comments: Comment[] }>`. Las peticiones se ejecutan al suscribirse.

La barra de búsqueda usa HTML básico, sin estilos, y emite el username mediante `@Output() search`. `AppComponent` realiza las consultas y, cuando ambas están listas, envía `user` a `UserDetailsComponent` y `posts` a `UserPostsComponent` mediante `@Input`. En el constructor se conecta un único flujo `username$`: `switchMap` cancela la búsqueda anterior cuando llega otro username y limpia sus resultados. `takeUntilDestroyed` realiza la limpieza al destruir el componente. Los errores se manejan dentro de cada búsqueda para permitir nuevos intentos. Los mensajes de carga, usuario no encontrado y error se muestran en el componente principal.

Después de obtener los posts, `AppComponent` pide los comentarios de cada post con `forkJoin`, dentro del mismo flujo de `switchMap` (sin suscripciones anidadas). Cuando llegan todos, envía `comments: Comment[]` a `UserPostsComponent` junto con `posts`. Si el usuario no tiene posts, no se hace ninguna consulta de comentarios.

- `UserDetailsComponent` muestra todos los datos de `User`, agrupados en información personal, contacto, características físicas, dirección, empresa, datos bancarios, criptomonedas y datos técnicos. La contraseña no se muestra.
- `UserPostsComponent` muestra cada post con su título, cuerpo, etiquetas, reacciones (me gusta y no me gusta) y vistas. Debajo van sus comentarios, con el nombre completo y el username del autor y sus me gusta. `commentsOf(postId)` filtra los comentarios de cada post.

`HttpClient` está configurado en `app.config.ts` y `index.html` contiene el punto de montaje de Angular. Las plantillas usan HTML básico; los estilos, Bootstrap y los iconos quedan para la fase 3.

Según el enunciado, el componente principal realizará las consultas y pasará los datos a los componentes hijos. Si el filtro no encuentra un usuario, la aplicación deberá informar que no existe y ocultar los datos y posts.

## Ejecutar

Desde la carpeta `RXJS-example`:

```bash
npm install
npm start
```

Abrir `http://localhost:4200/`. Para compilar: `npm run build`.

### Comandos con Make

El Makefile usa las mismas reglas que el proyecto Angular de referencia. Ejecutar los comandos desde `RXJS-example`:

| Comando | Acción |
| --- | --- |
| `make` o `make serve` | Iniciar el servidor de desarrollo. |
| `make start` | Alias de `make serve`. |
| `make install` | Instalar las versiones del lockfile con `npm ci`. |
| `make build` | Compilar para producción. |
| `make watch` | Recompilar al detectar cambios, en modo desarrollo. |
| `make test` | Ejecutar el runner configurado; todavía no hay casos de prueba. |
| `make typecheck` | Comprobar TypeScript, incluidas las interfaces. |
| `make check` | Comprobar los tipos y compilar para producción. |
| `make help` | Mostrar los comandos disponibles. |
