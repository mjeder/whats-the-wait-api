#!/bin/bash

API="http://localhost:4741"
URL_PATH="/guests"

curl "${API}${URL_PATH}/${WAITLIST_ID}/${GUEST_ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
