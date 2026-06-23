# gRPC Microservice Library System

A polyglot demo project showing microservice communication with [gRPC](https://grpc.io/).
The system models a simple library, exposing two operations (`GetBook` and `ListBooks`), served by a Java backend and consumed by both a browser and a Node.js client.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (port 8081)                                            │
│  grpc-web JS client (webpack-dev-server)                        │
└────────────────┬────────────────────────────────────────────────┘
                 │ HTTP/1.1  (grpc-web protocol)
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  Envoy Proxy (port 8282)                                        │
│  Translates grpc-web ↔ native gRPC (HTTP/2)                     │
└────────────────┬────────────────────────────────────────────────┘
                 │ HTTP/2 / gRPC
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  Java Spring Boot gRPC Server (port 9090)                       │
│  LibraryService · gRPC Health v1 · Proto Reflection             │
└─────────────────────────────────────────────────────────────────┘
                 ▲
                 │ HTTP/2 / gRPC (direct, bypasses Envoy)
┌────────────────┴────────────────────────────────────────────────┐
│  Node.js TypeScript gRPC Client (port 9090)                     │
└─────────────────────────────────────────────────────────────────┘
```

| Component | Language / Runtime | Role |
|---|---|---|
| `java-grpc-library-service` | Java 17, Spring Boot 4 | gRPC server |
| `browser-client` | JS, webpack 5, grpc-web 2 | Browser gRPC-Web client |
| `node-grpc-client` | TypeScript 5, @grpc/grpc-js | CLI gRPC client |
| `envoy` | Envoy v1.27.0 | gRPC-Web ↔ gRPC proxy |

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| [Docker](https://docs.docker.com/get-docker/) | ≥ 24 | Run the full stack |
| [Docker Compose](https://docs.docker.com/compose/) | ≥ 2.20 | Orchestrate services |
| [Java 17](https://adoptium.net/) | 17 (LTS) | Run / build the gRPC server locally |
| [Maven](https://maven.apache.org/) | ≥ 3.9 | Build the Java service (or use `./mvnw`) |
| [Node.js](https://nodejs.org/) | ≥ 20 | Run browser / Node clients locally |
| [protoc](https://grpc.io/docs/protoc-installation/) | ≥ 3.24 | Regenerate gRPC-Web JS stubs |
| [protoc-gen-grpc-web](https://github.com/grpc/grpc-web/releases) | ≥ 1.5 | Regenerate gRPC-Web JS stubs |

---

## Quick Start (Docker Compose)

The entire stack (Java server, Envoy proxy, and browser client) can be started with a single command:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Browser client | http://localhost:8081 |
| Envoy (gRPC-Web proxy) | http://localhost:8282 |
| Java gRPC server | localhost:9090 |

To stop everything:

```bash
docker-compose down
```

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

Open http://localhost:8081 then check the browser dev console for the gRPC responses.

### 4 - Node.js Client (optional)

```bash
cd node-grpc-client
npm install
npm run dev
```

Connects directly to the Java server on port **9090** (bypasses Envoy).

---

## Regenerating gRPC-Web Stubs

The browser client uses pre-generated JS stubs. To regenerate them after changing `library.proto`:

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

Tests use an in-process gRPC server - no network I/O or Spring context is started.

---

## API Reference

The gRPC contract is defined in [`library.proto`](java-grpc-library-service/src/main/proto/library.proto).

### Service: `library.LibraryService`

#### `GetBook`

Fetch a single book by its ID.

```proto
rpc GetBook (BookRequest) returns (BookResponse);
```

| Field | Type | Description |
|---|---|---|
| `id` | `int32` | Book ID to look up |

**Response:** `BookResponse` on success, `NOT_FOUND` status if the ID does not exist.

#### `ListBooks`

Return all books in the catalogue.

```proto
rpc ListBooks (google.protobuf.Empty) returns (BookList);
```

**Response:** `BookList` containing a repeated list of `BookResponse`.

### Message Types

```proto
message BookResponse {
  int32  id        = 1;
  string title     = 2;
  string author    = 3;
  bool   available = 4;
}

message BookList {
  repeated BookResponse books = 1;
}
```

---

## Health Check

The server implements the [gRPC Health Checking Protocol v1](https://grpc.io/docs/guides/health-checking/).

```bash
# Inspect with grpcurl (requires server reflection to be enabled)
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
├── java-grpc-library-service/   Java Spring Boot gRPC server
│   ├── src/main/proto/          Proto definitions
│   └── src/test/java/           Unit tests (in-process gRPC)
├── browser-client/              Webpack + grpc-web browser client
├── node-grpc-client/            TypeScript gRPC CLI client
├── envoy/                       Envoy proxy config & run script
└── docker-compose.yml           Orchestrates the full stack
```
