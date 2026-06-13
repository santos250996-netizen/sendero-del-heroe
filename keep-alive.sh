#!/bin/bash
while true; do
    cd /home/z/my-project
    npx next dev -p 3000 -H 0.0.0.0 2>&1
    echo "Server died, restarting in 2s..."
    sleep 2
done
