/* Firebase settings for the online version. These web keys are public by design;
   access to books is protected by the database rules (only approved accounts). */
window.FB_CONFIG = {
  apiKey: "AIzaSyAv-4EPR67KlBSbx9pPPmjLwt6WycfEc88",
  authDomain: "famlink-push.firebaseapp.com",
  databaseURL: "https://famlink-push-default-rtdb.firebaseio.com",
  projectId: "famlink-push",
  storageBucket: "famlink-push.firebasestorage.app",
  messagingSenderId: "565488951571",
  appId: "1:565488951571:web:b483ff764345abdbc7bae6"
};
/* public key for phone notifications (Firebase Cloud Messaging, same project) */
window.FB_VAPID = "BNfgABAHDbTr200i64UwnNM2mP3Y6yl9RD8SmIZT88rdqwjMwgq7RP1JnsNyiivWPvlD5AdDUYhff5znvMcKk4U";
