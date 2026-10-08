// Run after `npx cap add android`: makes the Android 12+ system launch screen dark too,
// so there's no white flash before the app's own opening animation.
import fs from 'node:fs';

const file = 'android/app/src/main/res/values/styles.xml';
let xml = fs.readFileSync(file, 'utf8');
if (!xml.includes('windowSplashScreenBackground')) {
  xml = xml.replace(
    '<item name="android:background">@drawable/splash</item>',
    '<item name="android:background">@drawable/splash</item>\n        <item name="windowSplashScreenBackground">#030712</item>',
  );
  fs.writeFileSync(file, xml);
}
console.log('Launch screen set to dark.');
