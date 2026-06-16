#!/bin/sh

echo "Running database migrations..."
node_modules/.bin/prisma migrate deploy || echo "WARNING: Migration failed, continuing anyway..."

echo "Starting application..."
exec node server.js
