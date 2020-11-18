const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()
const firestore = new admin.firestore.v1.FirestoreAdminClient({});

const {
  FIREBASE_CONFIG = '{}',
} = process.env

const {
  projectId,
  storageBucket,
} = JSON.parse(FIREBASE_CONFIG)

exports.backupFirestore = functions.region('europe-west1')
  .pubsub.schedule('every day 04:00').timeZone('Europe/Helsinki')
  .onRun(async () => {

  const timestamp = new Date().toISOString()
  const target = `gs://${storageBucket}/backups/firestore/${timestamp}`

  console.log(`Start to backup project ${projectId} to ${target}`)

  return firestore.exportDocuments({
    name: `projects/${projectId}/databases/(default)`,
    outputUriPrefix: target,
  })
})
