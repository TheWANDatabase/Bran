import admin from "firebase-admin"

if (!('FIREBASE_SERVICE_ACCOUNT_KEY' in process.env)) {
  throw new Error("Cannot launch API server without a Firebase Service Account environment variable")
}

if (typeof process.env.FIREBASE_SERVICE_ACCOUNT_KEY !== 'string') throw new Error("Firebase account is inavlid")

const frb = admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_KEY),
  databaseURL: "https://the-wan-db-37a19-default-rtdb.europe-west1.firebasedatabase.app"
});


export default {
  db: frb.firestore(),
  auth: frb.auth()
}