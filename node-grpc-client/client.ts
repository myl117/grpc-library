import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

// Load proto definition
const packageDef = protoLoader.loadSync(
  path.join(__dirname, "/proto/library.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

// Convert proto into gRPC object
const grpcObject = grpc.loadPackageDefinition(packageDef) as any;

// Create client
const client = new grpcObject.LibraryService(
  "localhost:9090",
  grpc.credentials.createInsecure()
);

client.getBook({ id: 1 }, (err: grpc.ServiceError | null, response: any) => {
  if (err) {
    console.error(err.message);
    return;
  }

  console.log("Book:", response);
});

client.listBooks({}, (err: grpc.ServiceError | null, response: any) => {
  if (err) {
    console.error(err.message);
    return;
  }

  console.log("Books:", response.books);
});
