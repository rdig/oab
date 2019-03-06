#!/bin/bash

if [ "$1" = "" ]; then
  echo "You must provide a subdomain name to use."
  echo "Eg: 'localtunnel my-oab-subdomain'"
fi;

SUBDOMAIN="$1"

localtunnel() {
  lt -s ${SUBDOMAIN} --port 8765
}

if [ $SUBDOMAIN ]; then
  until localtunnel; do
    echo "localtunnel Server CRASHED!"
    echo "Restarting..."
    sleep 2
  done
fi
