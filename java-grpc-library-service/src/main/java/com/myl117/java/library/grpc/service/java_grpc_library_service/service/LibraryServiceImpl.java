package com.myl117.java.library.grpc.service.java_grpc_library_service.service;

import com.google.protobuf.Empty;
import com.myl117.java.library.grpc.service.LibraryProto.BookList;
import com.myl117.java.library.grpc.service.LibraryProto.BookRequest;
import com.myl117.java.library.grpc.service.LibraryProto.BookResponse;
import com.myl117.java.library.grpc.service.LibraryServiceGrpc;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * gRPC service implementation for the Library service.
 * Package-private: this is an internal implementation detail managed by {@link GrpcServer}.
 */
class LibraryServiceImpl extends LibraryServiceGrpc.LibraryServiceImplBase {

  private final List<BookResponse> books = new CopyOnWriteArrayList<>();

  LibraryServiceImpl() {
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
  }

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
  public void listBooks(Empty request, StreamObserver<BookList> responseObserver) {
    responseObserver.onNext(BookList.newBuilder().addAllBooks(books).build());
    responseObserver.onCompleted();
  }
}
