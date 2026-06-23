package com.myl117.java.library.grpc.service.java_grpc_library_service.service;

import com.myl117.java.library.grpc.service.LibraryProto.BookRequest;
import com.myl117.java.library.grpc.service.LibraryProto.BookResponse;
import com.myl117.java.library.grpc.service.LibraryProto.BookList;
import com.myl117.java.library.grpc.service.LibraryServiceGrpc;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.Status;
import io.grpc.protobuf.services.ProtoReflectionService;
import io.grpc.stub.StreamObserver;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

@Component
public class GrpcServer {

  private static final Logger log = LoggerFactory.getLogger(GrpcServer.class);

  private Server server;

  // In-memory list of books — CopyOnWriteArrayList for thread safety under concurrent gRPC requests
  private final List<BookResponse> books = new CopyOnWriteArrayList<>();

  @PostConstruct
  public void start() throws IOException {
    // Add sample books
    books.add(BookResponse.newBuilder()
      .setId(1)
      .setTitle("1984")
      .setAuthor("George Orwell")
      .setAvailable(true)
      .build());
    books.add(BookResponse.newBuilder()
      .setId(2)
      .setTitle("The Hobbit")
      .setAuthor("J.R.R. Tolkien")
      .setAvailable(false)
      .build());
      books.add(BookResponse.newBuilder()
      .setId(3)
      .setTitle("Sunrise on the Reaping")
      .setAuthor("Suzanne Collins")
      .setAvailable(false)
      .build());

    // Start gRPC server on port 9090
    server = ServerBuilder.forPort(9090)
      .addService(new LibraryServiceImpl())
      .addService(ProtoReflectionService.newInstance())
      .build()
      .start();

    log.info("gRPC server started on port 9090");
  }

  @PreDestroy
  public void stop() throws InterruptedException {
    if (server != null) {
      log.info("Shutting down gRPC server...");
      server.shutdown();
      if (!server.awaitTermination(30, TimeUnit.SECONDS)) {
        log.warn("gRPC server did not terminate within 30 seconds; forcing shutdown");
        server.shutdownNow();
      }
      log.info("gRPC server stopped");
    }
  }

  // Implementation of the gRPC service
  private class LibraryServiceImpl extends LibraryServiceGrpc.LibraryServiceImplBase {

    @Override
    public void getBook(BookRequest request, StreamObserver<BookResponse> responseObserver) {
      Optional<BookResponse> book = books.stream()
        .filter(b -> b.getId() == request.getId())
        .findFirst();

      if (book.isPresent()) {
        responseObserver.onNext(book.get());
        responseObserver.onCompleted();
      } else {
        responseObserver.onError(
          Status.NOT_FOUND
            .withDescription("Book with id " + request.getId() + " not found")
            .asRuntimeException()
        );
      }
    }

    @Override
    public void listBooks(com.myl117.java.library.grpc.service.LibraryProto.Empty Empty, StreamObserver <BookList> responseObserver) {
      BookList.Builder builder = BookList.newBuilder();
      builder.addAllBooks(books);
      responseObserver.onNext(builder.build());
      responseObserver.onCompleted();
    }
  }
}