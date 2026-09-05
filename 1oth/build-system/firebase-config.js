/* ============================================================
   YOUR FIREBASE KEYS GO HERE.

   1. Go to  console.firebase.google.com  and open your project.
   2. Click the gear (Project settings) -> scroll to "Your apps" -> the web app.
   3. Copy the block that starts  const firebaseConfig = {  and ends  };
   4. DELETE everything below this comment and paste yours in its place.
   5. Save this file, then rebuild:   bash build.sh

   Until you do that, the app shows "Cannot reach the sign-in server" instead of
   pretending to work. That is deliberate.

   These keys are NOT secrets. Google publishes them in every web app; they only
   identify your project. What actually protects your class is firestore.rules,
   which you paste into the console separately.
   ============================================================ */

const firebaseConfig = {
    apiKey: "AIzaSyBUTNQBjypt-FqwglXTuPVo_g3XHE4X5Ck",
    authDomain: "frenchgrammar-84e33.firebaseapp.com",
    projectId: "frenchgrammar-84e33",
    storageBucket: "frenchgrammar-84e33.firebasestorage.app",
    messagingSenderId: "530064028793",
    appId: "1:530064028793:web:f53f337f14d72400dcd0a8"
  };

