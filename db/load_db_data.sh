#!/bin/bash
set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

# Create the 'template_postgis' template db
"${psql[@]}" <<- 'EOSQL'
  CREATE DATABASE template_postgis;
  UPDATE pg_database SET datistemplate = TRUE WHERE datname = 'template_postgis';
EOSQL

# Load PostGIS into both template_database and $POSTGRES_DB
for DB in template_postgis "$POSTGRES_DB"; do
	echo "Loading PostGIS extensions into $DB"
	"${psql[@]}" --dbname="$DB" <<-'EOSQL'
		CREATE EXTENSION IF NOT EXISTS postgis;
		CREATE EXTENSION IF NOT EXISTS postgis_topology;
		CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    	CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
EOSQL

echo "*** CREATING DATABASE ***"

# create default database
"${psql[@]}" <<- 'EOSQL'
    CREATE ROLE etools_unpp_user WITH superuser login;
    CREATE DATABASE etools_unpp;
    GRANT ALL PRIVILEGES ON DATABASE etools_unpp TO etools_unpp_user;
EOSQL

echo "*** DATABASE CREATED! ***"

done