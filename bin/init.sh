#!/bin/bash

curl \
    -H "Content-Type: application/json" \
    -X POST \
    -d '{"sql":"create table sensor_data(created INTEGER, sensor TEXT, state TEXT, rvalue REAL, metadata BLOB)", "params":""}' \
    http://${HOST}:${PORT}/sql/1/put

echo 