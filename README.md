# _**codeex quiz - backend**_

codeex quiz platform backend system using `Node.js`, `Nest.js`, `TypeScript` and `mongo db`.

**P.S: [docker](https://www.docker.com/) is required**

## _**installation**_

1. Clone the repo `git clone https://github.com/cs-fedy/codeex-quiz.git`
2. Change your current directory to the repo dir: `cd codeex-quiz`
3. make a `.env` file having the `key=value` pairs shown below.
4. Run `docker compose up -d` to start the db.
5. Seed the db: `yarn run db:seed` - accessible in the `api` directory
6. If not working with node as a container then install yarn: `np i -g yarn`
7. Install all the dependencies: `yarn install` - accessible in the `api` directory
8. Run the system in a dev env: `yarn run dev` - accessible in the `api` directory
   To drop db collections run: `yarn run db:drop` - accessible in the `api` directory

## _**used tools**_

1. [Node.js](https://nodejs.org/en/): Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
2. [Nest.js](https://nestjs.com/): A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
3. [TypeScript](https://www.typescriptlang.org/): TypeScript is JavaScript with syntax for types.
4. [Mongodb](https://www.mongodb.com/): MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.
5. [SendGrid](https://sendgrid.com/): Deliver Exceptional Email Experiences.

## _**.env key=value pairs**_

```
ENV=development
PORT=3001
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin
MONGO_INITDB_ROOT_URL='mongodb://admin:admin@localhost:27017'
REDIS_PORT=6379
REDIS_HOST=cache
CLIENT_URL="http://localhost:4000"
```
