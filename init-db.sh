# This is a script to initialize the database for the first time when the container is started.
# It will wait for the database to be ready before running the migrations.
# Wait for the 

echo "Database is ready. Running migrations..."

# Run the migrations
npm run sync:db
npm run seed

echo "Migrations complete. Database is ready."

# Start the application

npm run dev
