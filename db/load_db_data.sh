#!/bin/bash
set -e

# Perform all actions as $POSTGRES_USER
# export PGUSER="$POSTGRES_USER"
 export PGUSER="postgres"

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

done

echo "*** CREATING DATABASE ***"

# create default database
"${psql[@]}" <<- 'EOSQL'
    CREATE ROLE "$POSTGRES_USER" WITH superuser login;
    CREATE DATABASE "$POSTGRES_DB";
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO "$POSTGRES_USER";
EOSQL

echo "*** DATABASE CREATED! ***"

