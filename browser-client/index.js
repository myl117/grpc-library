import { LibraryServiceClient } from "./proto/library_grpc_web_pb";
import { BookRequest, Empty } from "./proto/library_pb";

// Connect to Envoy gRPC-Web proxy
const client = new LibraryServiceClient("http://localhost:8282", null, null);

// Get Book #1
const bookReq = new BookRequest();
bookReq.setId(1);

client.getBook(bookReq, {}, (err, res) => {
  if (err) {
    console.error("GetBook error:", err.message);
    return;
  }

  console.log("GetBook response:", {
    id: res.getId(),
    title: res.getTitle(),
    author: res.getAuthor(),
    available: res.getAvailable(),
  });
});

// List all books
const listReq = new Empty();

client.listBooks(listReq, {}, (err, res) => {
  if (err) {
    console.error("ListBooks error:", err.message);
    return;
  }

  const books = res.getBooksList().map((b) => ({
    id: b.getId(),
    title: b.getTitle(),
    author: b.getAuthor(),
    available: b.getAvailable(),
  }));

  console.log("ListBooks response:", books);
});
