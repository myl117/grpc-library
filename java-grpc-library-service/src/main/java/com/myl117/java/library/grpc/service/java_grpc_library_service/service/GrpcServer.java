package com.myl117.java.library.grpc.service.java_grpc_library_service.service;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.health.v1.HealthCheckResponse.ServingStatus;
import io.grpc.protobuf.services.HealthStatusManager;
import io.grpc.protobuf.services.ProtoReflectionService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
public class GrpcServer implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(GrpcServer.class);

  /** gRPC service name as declared in the proto (package + service). */
  private static final String SERVICE_NAME = "library.LibraryService";

  @Value("${grpc.server.port}")
  private int grpcPort;

  private Server server;
  private HealthStatusManager healthStatusManager;

  @PostConstruct
  public void start() throws IOException {
    healthStatusManager = new HealthStatusManager();

    server = ServerBuilder.forPort(grpcPort)
      .addService(new LibraryServiceImpl())
      .addService(ProtoReflectionService.newInstance())
      .addService(healthStatusManager.getHealthService())
      .build()
      .start();

    // Mark both the overall server and the specific service as healthy
    healthStatusManager.setStatus("", ServingStatus.SERVING);
    healthStatusManager.setStatus(SERVICE_NAME, ServingStatus.SERVING);

    log.info("gRPC server started on port {}", grpcPort);
  }

  @Override
  public void run(String... args) throws Exception {
    if (server != null) {
      log.info("Keeping gRPC server running (awaiting termination)...");
      server.awaitTermination();
    }
  }

  @PreDestroy
  public void stop() throws InterruptedException {
    if (server != null) {
      log.info("Shutting down gRPC server...");

      // Signal NOT_SERVING before draining so load balancers can stop routing
      if (healthStatusManager != null) {
        healthStatusManager.setStatus("", ServingStatus.NOT_SERVING);
        healthStatusManager.setStatus(SERVICE_NAME, ServingStatus.NOT_SERVING);
      }

      server.shutdown();
      if (!server.awaitTermination(30, TimeUnit.SECONDS)) {
        log.warn("gRPC server did not terminate within 30 seconds; forcing shutdown");
        server.shutdownNow();
      }
      log.info("gRPC server stopped");
    }
  }
}