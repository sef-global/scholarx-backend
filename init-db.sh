#!/bin/sh

# This is a script to initialize the database for the first time when the container is started.

# Wait for the database to be ready
until psql "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}" -c '\q'; do
  echo "Waiting for database connection..."
  sleep 5
done

echo "Database is ready. Running migrations..."

# Run the migrations
npm run sync:db

# Check if the database is already populated
SEED_CHECK=$(psql "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}" -tAc "SELECT COUNT(*) FROM profile;")

if [ "$SEED_CHECK" -eq "0" ]; then
  echo "Database is empty. Running seed script..."
  npm run seed
else
  echo "Database already contains data. Skipping seed script."
fi

echo "Migrations complete. Database is ready."

# Start the application
npm run dev
