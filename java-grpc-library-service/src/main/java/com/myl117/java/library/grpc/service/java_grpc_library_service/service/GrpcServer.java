package com.myl117.java.library.grpc.service.java_grpc_library_service.service;

import com.myl117.java.library.grpc.service.LibraryProto.BookRequest;
import com.myl117.java.library.grpc.service.LibraryProto.BookResponse;
import com.myl117.java.library.grpc.service.LibraryProto.BookList;
import com.myl117.java.library.grpc.service.LibraryServiceGrpc;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.stub.StreamObserver;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class GrpcServer {

  private Server server;

  // In-memory list of books
  private final List <BookResponse> books = new ArrayList <>();

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
      .build()
      .start();

    System.out.println("gRPC server started on port 9090");
  }

  @PreDestroy
  public void stop() {
    if (server != null) {
      server.shutdown();
      System.out.println("gRPC server stopped");
    }
  }

  // Implementation of the gRPC service
  private class LibraryServiceImpl extends LibraryServiceGrpc.LibraryServiceImplBase {

    @Override
    public void getBook(BookRequest request, StreamObserver <BookResponse> responseObserver) {
      Optional <BookResponse> book = books.stream()
        .filter(b -> b.getId() == request.getId())
        .findFirst();

      responseObserver.onNext(book.orElse(
        BookResponse.newBuilder()
        .setId(0)
        .setTitle("Not Found")
        .setAuthor("")
        .setAvailable(false)
        .build()
      ));
      responseObserver.onCompleted();
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