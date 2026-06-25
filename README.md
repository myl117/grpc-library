# gRPC Microservice Library System

[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-6DB33F?logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![gRPC](https://img.shields.io/badge/gRPC-enabled-244c5a?logo=grpc&logoColor=white)](https://grpc.io/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![Envoy](https://img.shields.io/badge/Envoy_Proxy-v1.27-AC6199?logo=envoy-proxy&logoColor=white)](https://www.envoyproxy.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub last commit](https://img.shields.io/github/last-commit/myl117/grpc-library)](https://github.com/myl117/grpc-library/commits/main)
[![GitHub stars](https://img.shields.io/github/stars/myl117/grpc-library?style=social)](https://github.com/myl117/grpc-library/stargazers)

A polyglot demo project showing microservice communication with [gRPC](https://grpc.io/).
The system models a library management system, exposing full CRUD operations (`GetBook`, `ListBooks`, `CreateBook`, `UpdateBook`, `DeleteBook`), served by a Java backend and consumed by both a browser and a Node.js client. The browser client integrates with the [Open Library API](https://openlibrary.org/developers/api) to auto-fill book metadata and cover art.

---

## Architecture

```
+------------------------------------------------------------------+
|  Browser (port 8081)                                             |
|  Premium dark-mode UI (webpack-dev-server + grpc-web)            |
+----------------------------+-------------------------------------+
                             | HTTP/1.1  (grpc-web protocol)
                             v
+------------------------------------------------------------------+
|  Envoy Proxy (port 8282)                                         |
|  Translates grpc-web to native gRPC (HTTP/2)                     |
+----------------------------+-------------------------------------+
                             | HTTP/2 / gRPC
                             v
+------------------------------------------------------------------+
|  Java Spring Boot gRPC Server (port 9090)                        |
|  LibraryService, gRPC Health v1, Proto Reflection                |
+------------------------------------------------------------------+
                             ^
                             | HTTP/2 / gRPC (direct, bypasses Envoy)
+----------------------------+-------------------------------------+
|  Node.js TypeScript gRPC Client                                  |
+------------------------------------------------------------------+

                             +
                             |
                             v
                  openlibrary.org/search.json   (book search, browser only)
                  covers.openlibrary.org/...    (cover images, browser only)
```

| Component | Language / Runtime | Role |
|---|---|---|
| `java-grpc-library-service` | Java 17, Spring Boot 4 | gRPC server |
| `browser-client` | JS, webpack 5, grpc-web 2 | Browser gRPC-Web client + UI |
| `node-grpc-client` | TypeScript 5, @grpc/grpc-js | CLI gRPC client |
| `envoy` | Envoy v1.27.0 | gRPC-Web to gRPC proxy |

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| [Docker](https://docs.docker.com/get-docker/) | >= 24 | Run the full stack |
| [Docker Compose](https://docs.docker.com/compose/) | >= 2.20 | Orchestrate services |
| [Java 17](https://adoptium.net/) | 17 (LTS) | Run / build the gRPC server locally |
| [Maven](https://maven.apache.org/) | >= 3.9 | Build the Java service (or use `./mvnw`) |
| [Node.js](https://nodejs.org/) | >= 20 | Run browser / Node clients locally |
| [protoc](https://grpc.io/docs/protoc-installation/) | >= 3.24 | Regenerate gRPC-Web JS stubs |
| [protoc-gen-grpc-web](https://github.com/grpc/grpc-web/releases) | >= 1.5 | Regenerate gRPC-Web JS stubs |

## Quick Start

You can start the entire stack (Java server, Envoy proxy, and browser client) using the NPM script shortcuts defined in the root package.json:

```bash
# Start the stack (equivalent to docker compose up)
npm start

# Build and start the stack (equivalent to docker compose up --build)
npm run start:build

# Stop the stack (equivalent to docker compose down)
npm run stop
```

### Port Mapping

Once the stack is running, the services are accessible at:

| Service | URL |
|---|---|
| Browser client | http://localhost:8081 |
| Envoy (gRPC-Web proxy) | http://localhost:8282 |
| Java gRPC server | localhost:9090 |

---

---

## Using the Browser UI

Navigate to **http://localhost:8081** after starting the stack. The status dot in the header turns green when the gRPC server is reachable.

### Adding a book

1. Click **Add Book** in the header or the floating **+** button.
2. In the modal, type a title or author in the **Open Library search** box and click **Search**.
3. Click any result to auto-fill the title, author, ISBN, publication year, and cover image.
4. Adjust any fields and click **Save Book**.

### Editing a book

Click the **Edit** button on any book card. The modal opens pre-filled with the current data. Make changes and click **Update Book**.

### Deleting a book

Click the **Delete** button on any card. A confirmation dialog appears before the book is removed.

### Filtering and searching

Use the search bar to filter by title, author, or ISBN. Use the **All / Available / Checked Out** buttons to filter by availability.

---

## Manual Setup

Start each component in a separate terminal, in this order.

### 1 - Java gRPC Server

```bash
cd java-grpc-library-service
./mvnw spring-boot:run
```

The server starts on port **9090** by default. Override with:

```bash
GRPC_SERVER_PORT=9191 ./mvnw spring-boot:run
```

Or add `grpc.server.port=9191` to `src/main/resources/application.properties`.

### 2 - Envoy Proxy

```bash
cd envoy
bash run-envoy.sh
```

Envoy listens on port **8282** and forwards to `host.docker.internal:9090`.

### 3 - Browser Client

```bash
cd browser-client
npm install
npm run dev
```

Open http://localhost:8081.

### 4 - Node.js Client (optional)

```bash
cd node-grpc-client
npm install
npm run dev
```

Connects directly to the Java server on port **9090** (bypasses Envoy). Runs through all five CRUD operations as a demo.

---

## Regenerating gRPC-Web Stubs

The browser client ships with pre-generated JS stubs. To regenerate them after changing `library.proto`:

```bash
cd browser-client
bash compile-protobuf.sh
```

This requires `protoc` and `protoc-gen-grpc-web` on your `PATH`.

---

## Running Tests

```bash
cd java-grpc-library-service
./mvnw test
```

---

## API Reference

The gRPC contract is defined in [`library.proto`](java-grpc-library-service/src/main/proto/library.proto).

### Service: `library.LibraryService`

#### `GetBook`

Fetch a single book by its ID.

```proto
rpc GetBook (BookRequest) returns (BookResponse);
```

Returns `NOT_FOUND` if the ID does not exist.

#### `ListBooks`

Return all books in the catalogue.

```proto
rpc ListBooks (google.protobuf.Empty) returns (BookList);
```

#### `CreateBook`

Add a new book. Title and author are required.

```proto
rpc CreateBook (CreateBookRequest) returns (BookResponse);
```

Returns `INVALID_ARGUMENT` if title or author is blank.

#### `UpdateBook`

Replace all fields of an existing book by ID.

```proto
rpc UpdateBook (UpdateBookRequest) returns (BookResponse);
```

Returns `NOT_FOUND` if the ID does not exist.

#### `DeleteBook`

Remove a book by ID.

```proto
rpc DeleteBook (BookRequest) returns (DeleteBookResponse);
```

Returns `NOT_FOUND` if the ID does not exist.

### Message Types

```proto
message BookResponse {
  int32  id             = 1;
  string title          = 2;
  string author         = 3;
  bool   available      = 4;
  string isbn           = 5;
  string description    = 6;
  string cover_url      = 7;
  int32  published_year = 8;
}

message CreateBookRequest {
  string title          = 1;
  string author         = 2;
  bool   available      = 3;
  string isbn           = 4;
  string description    = 5;
  string cover_url      = 6;
  int32  published_year = 7;
}

message UpdateBookRequest {
  int32  id             = 1;
  string title          = 2;
  string author         = 3;
  bool   available      = 4;
  string isbn           = 5;
  string description    = 6;
  string cover_url      = 7;
  int32  published_year = 8;
}

message DeleteBookResponse {
  bool   success = 1;
  string message = 2;
}

message BookList {
  repeated BookResponse books = 1;
}
```

---

## Open Library Integration

The browser client calls the Open Library API directly from the browser (no proxy needed, CORS is supported).

| Endpoint | Usage |
|---|---|
| `https://openlibrary.org/search.json?q=...` | Search books by title, author, or ISBN |
| `https://covers.openlibrary.org/b/id/{id}-L.jpg` | Fetch cover image by Open Library cover ID |
| `https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg` | Fetch cover image by ISBN |

---

## Health Check

The server implements the [gRPC Health Checking Protocol v1](https://grpc.io/docs/guides/health-checking/).

```bash
grpcurl -plaintext localhost:9090 grpc.health.v1.Health/Check
```

---

## Configuration

| Property | Default | Description |
|---|---|---|
| `grpc.server.port` | `9090` | Port the gRPC server binds to |
| `spring.application.name` | `java-grpc-library-service` | App name shown in logs |

Set via `application.properties` or as environment variables (e.g. `GRPC_SERVER_PORT=9091`).

---

## Project Structure

```
grpc-library/
+-- java-grpc-library-service/   Java Spring Boot gRPC server
|   +-- src/main/proto/          Proto definitions (library.proto)
|   +-- src/main/java/           Service implementation (CRUD)
|   +-- src/test/java/           Unit tests
+-- browser-client/              Webpack + grpc-web browser client
|   +-- proto/                   Pre-generated JS protobuf stubs
|   +-- index.html               Premium dark-mode UI
|   +-- index.js                 CRUD logic + Open Library integration
+-- node-grpc-client/            TypeScript gRPC CLI client
+-- envoy/                       Envoy proxy config and run script
+-- docker-compose.yml           Orchestrates the full stack
```
