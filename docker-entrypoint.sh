#!/bin/sh
set -e

echo "Running Prisma migrations..."
# Pinned on purpose - see the CMD comment in the Dockerfile.
npx prisma@7.4.0 migrate deploy

echo "Starting Next.js server..."
node server.js
