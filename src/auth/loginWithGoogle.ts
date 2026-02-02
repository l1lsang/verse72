import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";

import { auth } from "@/src/config/firebase";

/**
 * 🔵 Google 네이티브 로그인
 * - @react-native-google-signin/google-signin 최신 타입 대응
 */
export async function loginWithGoogleNative() {
  // Google Play Services 확인
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  // 로그인 실행
  const response = await GoogleSignin.signIn();

  // ✅ 최신 구조: response.data.idToken
  const idToken = response.data?.idToken;

  if (!idToken) {
    throw new Error("NO_ID_TOKEN");
  }

  // Firebase credential 생성
  const credential =
    GoogleAuthProvider.credential(idToken);

  // Firebase 로그인
  await signInWithCredential(auth, credential);
}
