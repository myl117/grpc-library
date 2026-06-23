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
  isbn: string;
  description: string;
  cover_url: string;
  published_year: number;
}

interface BookList {
  books: BookResponse[];
}

interface CreateBookRequest {
  title: string;
  author: string;
  available: boolean;
  isbn?: string;
  description?: string;
  cover_url?: string;
  published_year?: number;
}

interface UpdateBookRequest {
  id: number;
  title: string;
  author: string;
  available: boolean;
  isbn?: string;
  description?: string;
  cover_url?: string;
  published_year?: number;
}

interface DeleteBookResponse {
  success: boolean;
  message: string;
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

  createBook(
    request: CreateBookRequest,
    callback: (err: grpc.ServiceError | null, response: BookResponse) => void
  ): grpc.ClientUnaryCall;

  updateBook(
    request: UpdateBookRequest,
    callback: (err: grpc.ServiceError | null, response: BookResponse) => void
  ): grpc.ClientUnaryCall;

  deleteBook(
    request: BookRequest,
    callback: (err: grpc.ServiceError | null, response: DeleteBookResponse) => void
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
const LibraryService = (
  (grpcObject as any)["library"]?.["LibraryService"] ??
  (grpcObject as Record<string, grpc.ServiceClientConstructor>)["LibraryService"]
) as grpc.ServiceClientConstructor;

const client = new LibraryService(
  "localhost:9090",
  grpc.credentials.createInsecure()
) as unknown as LibraryServiceClient;

// ── Helper: promisify callback-based calls ─────────────────────────────────

function call<Req, Res>(
  method: (req: Req, cb: (err: grpc.ServiceError | null, res: Res) => void) => grpc.ClientUnaryCall,
  request: Req
): Promise<Res> {
  return new Promise((resolve, reject) => {
    method.call(client, request, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

// ── Demo calls ────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Library gRPC Demo ===\n");

  // 1. List all books
  const list = await call<Record<string, never>, BookList>(client.listBooks, {});
  console.log("ListBooks:", list.books.map(b => `[${b.id}] ${b.title} by ${b.author} (${b.available ? "available" : "out"})`));
  console.log();

  // 2. Get a single book
  const book = await call<BookRequest, BookResponse>(client.getBook, { id: 1 });
  console.log("GetBook #1:", book);
  console.log();

  // 3. Create a new book
  const created = await call<CreateBookRequest, BookResponse>(client.createBook, {
    title:          "The Great Gatsby",
    author:         "F. Scott Fitzgerald",
    available:      true,
    isbn:           "9780743273565",
    description:    "A novel about the American Dream set in the Jazz Age.",
    cover_url:      "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    published_year: 1925,
  });
  console.log("CreateBook:", created);
  console.log();

  // 4. Update the newly created book
  const updated = await call<UpdateBookRequest, BookResponse>(client.updateBook, {
    id:             created.id,
    title:          created.title,
    author:         created.author,
    available:      false,           // mark as checked out
    isbn:           created.isbn,
    description:    created.description,
    cover_url:      created.cover_url,
    published_year: created.published_year,
  });
  console.log("UpdateBook (marked unavailable):", updated);
  console.log();

  // 5. Delete the created book
  const deleted = await call<BookRequest, DeleteBookResponse>(client.deleteBook, { id: created.id });
  console.log("DeleteBook:", deleted);
  console.log();

  // 6. Confirm deletion by listing again
  const finalList = await call<Record<string, never>, BookList>(client.listBooks, {});
  console.log("Final list:", finalList.books.map(b => `[${b.id}] ${b.title}`));
}

main().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
