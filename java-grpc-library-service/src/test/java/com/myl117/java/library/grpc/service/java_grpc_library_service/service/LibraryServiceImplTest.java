package com.myl117.java.library.grpc.service.java_grpc_library_service.service;

import com.google.protobuf.Empty;
import com.myl117.java.library.grpc.service.LibraryProto.BookList;
import com.myl117.java.library.grpc.service.LibraryProto.BookRequest;
import com.myl117.java.library.grpc.service.LibraryProto.BookResponse;
import com.myl117.java.library.grpc.service.LibraryServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.Server;
import io.grpc.StatusRuntimeException;
import io.grpc.inprocess.InProcessChannelBuilder;
import io.grpc.inprocess.InProcessServerBuilder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import static io.grpc.Status.Code.NOT_FOUND;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests for {@link LibraryServiceImpl} using an in-process gRPC server.
 * No network I/O or Spring context is started — these tests are fast.
 */
@DisplayName("LibraryServiceImpl")
class LibraryServiceImplTest {

  private Server server;
  private ManagedChannel channel;
  private LibraryServiceGrpc.LibraryServiceBlockingStub stub;

  @BeforeEach
  void setUp() throws IOException {
    String serverName = InProcessServerBuilder.generateName();

    server = InProcessServerBuilder.forName(serverName)
      .directExecutor()
      .addService(new LibraryServiceImpl())
      .build()
      .start();

    channel = InProcessChannelBuilder.forName(serverName)
      .directExecutor()
      .build();

    stub = LibraryServiceGrpc.newBlockingStub(channel);
  }

  @AfterEach
  void tearDown() throws InterruptedException {
    channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
    server.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
  }

  // ── GetBook ───────────────────────────────────────────────────────────────

  @Test
  @DisplayName("getBook returns correct book for a valid id")
  void getBook_withValidId_returnsCorrectBook() {
    BookResponse response = stub.getBook(BookRequest.newBuilder().setId(1).build());

    assertThat(response.getId()).isEqualTo(1);
    assertThat(response.getTitle()).isEqualTo("1984");
    assertThat(response.getAuthor()).isEqualTo("George Orwell");
    assertThat(response.getAvailable()).isTrue();
  }

  @Test
  @DisplayName("getBook returns correct book for another valid id")
  void getBook_withAnotherValidId_returnsCorrectBook() {
    BookResponse response = stub.getBook(BookRequest.newBuilder().setId(2).build());

    assertThat(response.getId()).isEqualTo(2);
    assertThat(response.getTitle()).isEqualTo("The Hobbit");
    assertThat(response.getAuthor()).isEqualTo("J.R.R. Tolkien");
    assertThat(response.getAvailable()).isFalse();
  }

  @Test
  @DisplayName("getBook returns NOT_FOUND status for an unknown id")
  void getBook_withUnknownId_throwsNotFoundStatus() {
    BookRequest request = BookRequest.newBuilder().setId(999).build();

    assertThatThrownBy(() -> stub.getBook(request))
      .isInstanceOf(StatusRuntimeException.class)
      .satisfies(ex ->
        assertThat(((StatusRuntimeException) ex).getStatus().getCode())
          .isEqualTo(NOT_FOUND)
      );
  }

  // ── ListBooks ─────────────────────────────────────────────────────────────

  @Test
  @DisplayName("listBooks returns all seeded books")
  void listBooks_returnsAllBooks() {
    BookList response = stub.listBooks(Empty.getDefaultInstance());

    assertThat(response.getBooksList()).hasSize(3);
    assertThat(response.getBooksList())
      .extracting(BookResponse::getId)
      .containsExactly(1, 2, 3);
  }

  @Test
  @DisplayName("listBooks returns books with correct titles")
  void listBooks_bookTitlesMatchExpected() {
    BookList response = stub.listBooks(Empty.getDefaultInstance());

    assertThat(response.getBooksList())
      .extracting(BookResponse::getTitle)
      .containsExactly("1984", "The Hobbit", "Sunrise on the Reaping");
  }
}
