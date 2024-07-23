#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE testdb;
  CREATE USER testuser WITH ENCRYPTED PASSWORD 'testpassword';
  GRANT ALL PRIVILEGES ON DATABASE testdb TO testuser;
EOSQL
