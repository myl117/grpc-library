docker run --rm \
  -p 8282:8282 \
  -v ./envoy.yaml:/etc/envoy/envoy.yaml \
  envoyproxy/envoy:v1.27.0

# docker run --rm --network=host -v ./envoy.yaml:/etc/envoy/envoy.yaml envoyproxy/envoy:v1.27.0

# docker run --rm fullstorydev/grpcurl -plaintext host.docker.internal:9090 list

# Run this command in the Windows CLI!
# docker run --rm -p 8282:8282 -v "C:\Users\Mo\Documents\Personal\grpc-library\envoy\envoy.yaml:/etc/envoy/envoy.yaml" envoyproxy/envoy:v1.36.0
