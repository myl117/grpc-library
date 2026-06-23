import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

// ── Proto-derived types ────────────────────────────────────────────────────

interface BookRequest {
  id: number;
}

interface BookResponse {
  id: number;
  title: string;
  author: string;
  available: boolean;
}

interface BookList {
  books: BookResponse[];
}

interface LibraryServiceClient extends grpc.Client {
  getBook(
    request: BookRequest,
    callback: (err: grpc.ServiceError | null, response: BookResponse) => void
  ): grpc.ClientUnaryCall;

  listBooks(
    request: Record<string, never>,
    callback: (err: grpc.ServiceError | null, response: BookList) => void
  ): grpc.ClientUnaryCall;
}

// ── Client setup ───────────────────────────────────────────────────────────

const packageDef = protoLoader.loadSync(
  path.join(__dirname, "/proto/library.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [path.join(__dirname, "/proto")],
  }
);

const grpcObject = grpc.loadPackageDefinition(packageDef);
const LibraryService = (grpcObject as Record<string, grpc.ServiceClientConstructor>)["library"]?.["LibraryService"]
  ?? (grpcObject as Record<string, grpc.ServiceClientConstructor>)["LibraryService"];

const client = new LibraryService(
  "localhost:9090",
  grpc.credentials.createInsecure()
) as unknown as LibraryServiceClient;

// ── Calls ──────────────────────────────────────────────────────────────────

client.getBook({ id: 1 }, (err, response) => {
  if (err) {
    console.error("getBook error:", err.message);
    return;
  }
  console.log("Book:", response);
});

client.listBooks({}, (err, response) => {
  if (err) {
    console.error("listBooks error:", err.message);
    return;
  }
  console.log("Books:", response.books);
});
