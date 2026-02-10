1. ¿Qué endpoint has creado y por qué?

Se ha creado el DTo de las notas, y con este los endpoint necesarios para crearlo, obetener todos, obtener por ID, Actualizar por ID y borrar, son al cabo los endpoint necesarios para el uso completo del objeto Nota

2. ¿Cómo has implementado la seguridad?

La seguridad en si ya estaba implemetada desde antes con JWT para que al iniciar sesion te de un token, este se comprueba para que puedas borar y editar solo tus notas, al menos que tenga el rol de admin que puede tocar todo

3. ¿Capturas o comandos para probarlo?

mvnw springboot:run
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"adiaan158g@gmail.com","password":"123456"}'
curl -X POST http://localhost:8080/api/notas -H "Content-Type: application/json" -H "Authorization : Bearer <TOKEN>" -d '{"titulo":"Nota de prueba","contenido":"Contenido de la nota de prueba"}'