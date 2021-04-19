#!/bin/bash

API="http://localhost:4741"
URL_PATH="/guests"

curl "${API}${URL_PATH}/${WAITLIST_ID}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "guest": {
      "name": "'"${NAME}"'",
      "count": "'"${COUNT}"'",
      "phone": "'"${PHONE}"'",
      "quote": "'"${QUOTE}"'",
      "notes": "'"${NOTES}"'",
      "table": "'"${TABLE}"'"
    }
  }'

echo
