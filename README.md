<div align="center">
  <img height="80" width="80" src="https://user-images.githubusercontent.com/11836617/223146318-445e0d73-f4af-4e92-bc15-0f8296a02650.png">
  <h1>Code Assignment @ Toca Boca</h1>
  <img src="https://img.shields.io/badge/type-backend-FF5A00">
  <img src="https://img.shields.io/badge/language-TypeScript-00AFFF">
  <img src="https://img.shields.io/badge/concepts-REST APIs & databases-05C805">
  <br/><br/>
</div>

## Toca Boca API

This project implements a simplified REST API for managing game packs. It is written in TypeScript using the NestJS framework and uses PostgreSQL as the database.

### Setup Instructions

1. **Clone the repository**:
   ```sh
   git clone https://github.com/tryshank/game-packs-api.git
   cd game-packs-api
   ```

2. **Install dependencies**:
   ```sh
   pnpm install
   ```

3. **Create environment files**:
   - **`.env`** (for production):
     ```env
     POSTGRES_USER=tocabocauser
     POSTGRES_PASSWORD=securepassword
     POSTGRES_DB=tocabocadb
     DATABASE_URL=postgres://tocabocauser:securepassword@db:5432/tocabocadb
     APP_PORT=8080

     ```

   - **`.env.test`** (for testing):
     ```env
     POSTGRES_USER=testuser
     POSTGRES_PASSWORD=testpassword
     POSTGRES_DB=testdb
     DATABASE_URL=postgres://testuser:testpassword@db:5432/testdb
     APP_PORT=8081
     ```

4. **Run the application using Docker Compose**:
   ```sh
   docker-compose up --build
   ```

5. **Run the e2e tests using Docker Compose**:
   ```sh
   docker-compose -f docker-compose.e2e.yml up --build
   ```

### Usage Instructions

- **POST `/packs`** - Saves a pack to the database.
  - Request body example:
    ```json
    {
      "id": "pack.school",
      "packName": "The School Pack",
      "active": true,
      "price": 10,
      "content": ["furniture.whiteboard"],
      "childPackIds": ["pack.classroom", "pack.playground"]
    }
    ```
  - Example `curl` command:
    ```sh
    curl -X POST http://localhost:8080/packs \
    -H "Content-Type: application/json" \
    -d '{
      "id": "pack.school",
      "packName": "The School Pack",
      "active": true,
      "price": 10,
      "content": ["furniture.whiteboard"],
      "childPackIds": ["pack.classroom", "pack.playground"]
    }'
    ```

- **GET `/packs`** - Returns all packs that are in the database.
  - Response example:
    ```json
    [
      {
        "id": "pack.school",
        "packName": "The School Pack",
        "active": true,
        "price": 10,
        "content": ["furniture.whiteboard"],
        "childPackIds": ["pack.classroom", "pack.playground"]
      }
    ]
    ```
  - Example `curl` command:
    ```sh
    curl -X GET http://localhost:8080/packs
    ```

- **GET `/packs/:id/content`** - Returns a flat, unique list of all `content` a pack contains, including the contents of its child packs.
  - Response example:
    ```json
    ["furniture.whiteboard", "furniture.desk", "toy.ball"]
    ```
  - Example `curl` command:
    ```sh
    curl -X GET http://localhost:8080/packs/pack.school/content
    ```

### Examples of Creating Packs with Children and Parents

1. **Create a child pack**:
   ```sh
   curl -X POST http://localhost:8080/packs \
   -H "Content-Type: application/json" \
   -d '{
     "id": "pack.classroom",
     "packName": "The Classroom Pack",
     "active": true,
     "price": 5,
     "content": ["furniture.desk"],
     "childPackIds": []
   }'
   ```

2. **Create a parent pack that includes the child pack**:
   ```sh
   curl -X POST http://localhost:8080/packs \
   -H "Content-Type: application/json" \
   -d '{
     "id": "pack.school",
     "packName": "The School Pack",
     "active": true,
     "price": 10,
     "content": ["furniture.whiteboard", "toy.ball"],
     "childPackIds": ["pack.classroom"]
   }'
   ```

### Swagger API Documentation

The API documentation is available via Swagger. Once the application is running, you can access the documentation at:
```
http://localhost:8080/api
```

### Tests

To run the tests, use the following command:
```sh
pnpm run test
```

### Environment Variables

- `DATABASE_URL`: Connection string for the PostgreSQL database.
- `APP_PORT`: Port for the application to run on.

### Technologies and Tools

- **Service**: [Node](https://nodejs.org/), [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Testing**: [Jest](https://jestjs.io/)

### Additional Information

- This project is configured to use `pnpm` for package management.
- The Docker setup ensures that both the service and the database can be started with a single `docker-compose up` command.
- The code includes unit tests for the service and controller layers to ensure functionality.
- Ensure `synchronize` is set to `false` in production for TypeORM to avoid accidental schema changes. Use migrations instead.

### Checklist

- [x] Written in TypeScript.
- [x] Includes all expected endpoints.
- [x] Has sufficient tests that are passing.
- [x] Has sufficient documentation.
- [x] Can be started with a single `docker-compose up` command.
