cd functions
npm i
cd ../client
{
  echo "export const firebaseConfig = {"
  echo "  apiKey: \"$API_KEY\","
  echo "  authDomain: \"$AUTH_DOMAIN\","
  echo "  databaseURL: \"$DATABASE_URL\","
  echo "  messagingSenderId: \"$MESSAGING_SENDER_ID\","
  echo "  projectId: \"$PROJECT_ID\","
  echo "  storageBucket: \"$STORAGE_BUCKET\""
  echo "};"
} >> src/app/config.ts
cat src/app/config.ts
npm i
npm run release
