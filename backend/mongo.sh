#!/bin/bash

set -Eeuo pipefail
set -x

usage() {
    echo "Usage: $0 (start|verify|stop|reset)"
}

if [ $# -ne 1 ]; then
    usage
    exit 1
fi

case $1 in
    "start")
        systemctl start mongod
        systemctl status mongod
        ;;
    "verify")
        systemctl status mongod
        ;;
    "stop")
        systemctl stop mongod
        ;;
    "reset")
        systemctl restart mongod
        ;;
esac