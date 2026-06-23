package com.myl117.java.library.grpc.service.java_grpc_library_service.service;

import com.google.protobuf.Empty;
import com.myl117.java.library.grpc.service.LibraryProto.BookList;
import com.myl117.java.library.grpc.service.LibraryProto.BookRequest;
import com.myl117.java.library.grpc.service.LibraryProto.BookResponse;
import com.myl117.java.library.grpc.service.LibraryProto.CreateBookRequest;
import com.myl117.java.library.grpc.service.LibraryProto.UpdateBookRequest;
import com.myl117.java.library.grpc.service.LibraryProto.DeleteBookResponse;
import com.myl117.java.library.grpc.service.LibraryServiceGrpc;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * gRPC service implementation for the Library service.
 * Supports full CRUD: GetBook, ListBooks, CreateBook, UpdateBook, DeleteBook.
 * Package-private: this is an internal implementation detail managed by {@link GrpcServer}.
 */
class LibraryServiceImpl extends LibraryServiceGrpc.LibraryServiceImplBase {

  private final List<BookResponse> books = new CopyOnWriteArrayList<>();
  private final AtomicInteger idCounter = new AtomicInteger(4);

  LibraryServiceImpl() {
    books.add(BookResponse.newBuilder()
      .setId(1)
      .setTitle("1984")
      .setAuthor("George Orwell")
      .setAvailable(true)
      .setIsbn("9780451524935")
      .setDescription("A dystopian novel set in a totalitarian society ruled by Big Brother, following Winston Smith's rebellion against the oppressive regime.")
      .setCoverUrl("https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg")
      .setPublishedYear(1949)
      .build());
    books.add(BookResponse.newBuilder()
      .setId(2)
      .setTitle("The Hobbit")
      .setAuthor("J.R.R. Tolkien")
      .setAvailable(false)
      .setIsbn("9780261102217")
      .setDescription("The prelude to The Lord of the Rings, following hobbit Bilbo Baggins on an unexpected journey to reclaim the dwarves' mountain home.")
      .setCoverUrl("https://covers.openlibrary.org/b/isbn/9780261102217-L.jpg")
      .setPublishedYear(1937)
      .build());
    books.add(BookResponse.newBuilder()
      .setId(3)
      .setTitle("Sunrise on the Reaping")
      .setAuthor("Suzanne Collins")
      .setAvailable(false)
      .setIsbn("9780702339936")
      .setDescription("A prequel to The Hunger Games, telling the story of the 50th Hunger Games through the eyes of a young Haymitch Abernathy.")
      .setCoverUrl("https://covers.openlibrary.org/b/isbn/9780702339936-L.jpg")
      .setPublishedYear(2025)
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

  @Override
  public void createBook(CreateBookRequest request, StreamObserver<BookResponse> responseObserver) {
    if (request.getTitle().isBlank() || request.getAuthor().isBlank()) {
      responseObserver.onError(
        Status.INVALID_ARGUMENT
          .withDescription("Title and author are required")
          .asRuntimeException()
      );
      return;
    }

    int newId = idCounter.getAndIncrement();
    BookResponse newBook = BookResponse.newBuilder()
      .setId(newId)
      .setTitle(request.getTitle())
      .setAuthor(request.getAuthor())
      .setAvailable(request.getAvailable())
      .setIsbn(request.getIsbn())
      .setDescription(request.getDescription())
      .setCoverUrl(request.getCoverUrl())
      .setPublishedYear(request.getPublishedYear())
      .build();

    books.add(newBook);
    responseObserver.onNext(newBook);
    responseObserver.onCompleted();
  }

  @Override
  public void updateBook(UpdateBookRequest request, StreamObserver<BookResponse> responseObserver) {
    int idx = -1;
    for (int i = 0; i < books.size(); i++) {
      if (books.get(i).getId() == request.getId()) {
        idx = i;
        break;
      }
    }

    if (idx < 0) {
      responseObserver.onError(
        Status.NOT_FOUND
          .withDescription("Book with id " + request.getId() + " not found")
          .asRuntimeException()
      );
      return;
    }

    BookResponse updated = BookResponse.newBuilder()
      .setId(request.getId())
      .setTitle(request.getTitle())
      .setAuthor(request.getAuthor())
      .setAvailable(request.getAvailable())
      .setIsbn(request.getIsbn())
      .setDescription(request.getDescription())
      .setCoverUrl(request.getCoverUrl())
      .setPublishedYear(request.getPublishedYear())
      .build();

    books.set(idx, updated);
    responseObserver.onNext(updated);
    responseObserver.onCompleted();
  }

  @Override
  public void deleteBook(BookRequest request, StreamObserver<DeleteBookResponse> responseObserver) {
    boolean removed = books.removeIf(b -> b.getId() == request.getId());

    if (removed) {
      responseObserver.onNext(
        DeleteBookResponse.newBuilder()
          .setSuccess(true)
          .setMessage("Book with id " + request.getId() + " deleted successfully")
          .build()
      );
      responseObserver.onCompleted();
    } else {
      responseObserver.onError(
        Status.NOT_FOUND
          .withDescription("Book with id " + request.getId() + " not found")
          .asRuntimeException()
      );
    }
  }
}
