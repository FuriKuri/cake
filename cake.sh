#!/bin/sh

if [[ $# -ne 2 ]]; then
  printf "Usage: \n  cake [field] [value]

Available fields:
  --twitter   your twitter id
  --github    your github id
  --name      just your name\n"
  exit 1
fi

FIELD=$1
FIELD_NAME=${FIELD:2}
VALUE=$2

/usr/bin/curl -sS -X "POST" "https://cake.furikuri.net/" \
     -H "Content-Type: application/json" \
     -d "{\"$FIELD_NAME\": \"$VALUE\"}"
