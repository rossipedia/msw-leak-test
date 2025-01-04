#!/bin/bash

# Requirements:
# ab   - Apache HTTP server benchmarking tool
# curl - command line tool for transferring data with URL syntax

run-test() {

  if [ -z "$ENABLE_MSW" ]; then
    echo "Running without MSW"
    label="without-msw"
  else
    echo "Running with MSW"
    label="with-msw"
  fi

  # 1. Kick off the API
  npm run api &
  API_PID=$!

  # 2 Kick off the app server
  npm run start &
  APP_PID=$!

  # 3. Wait a beat to ensure all the node stuff is running
  sleep 0.5s

  # 4. Take a heap snapshot
  curl -X POST "http://localhost:3000/snapshot?name=${label}-1-before"

  # # 5. Run the load test
  ab -n 5000 -c 4 -q http://localhost:3000/
  # curl http://localhost:3000/

  # 6. Take another heap snapshot
  curl -X POST "http://localhost:3000/snapshot?name=${label}-2-after"

  # kill the processes
  kill $API_PID
  kill $APP_PID

  wait $API_PID $APP_PID
}

run-test
ENABLE_MSW=true run-test