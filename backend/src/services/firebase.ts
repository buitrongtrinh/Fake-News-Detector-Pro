import admin from 'firebase-admin';
import serviceAccount from './fake-news-detecto-firebase-adminsdk-fbsvc-fbd4c0755b.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const firebaseAdmin = admin;
