#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 5432; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - executing command"
exec $cmd
