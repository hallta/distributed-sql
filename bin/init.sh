#!/bin/bash

curl \
    -H "Content-Type: application/json" \
    -X POST \
    -d '{"sql":"create table foo(x)", "params":""}' \
    http://${HOST}:${PORT}/sql/1/put

echo 