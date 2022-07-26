#!/bin/bash

set -x
set -Eeuo pipefail

cd backend
./mongo.sh start
npm start