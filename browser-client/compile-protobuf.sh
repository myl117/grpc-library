#!/usr/bin/env bash
set -euo pipefail

protoc ./proto/library.proto \
  --js_out=import_style=commonjs:./ \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./
