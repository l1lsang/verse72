import Constants from "expo-constants";
import * as Linking from "expo-linking";

const KAKAO_REST_API_KEY =
  Constants.expoConfig?.extra?.KAKAO_REST_API_KEY;

const REDIRECT_URI =
  "https://72-3.vercel.app/auth/kakao";

export function loginWithKakaoWeb() {
  if (!KAKAO_REST_API_KEY) {
    console.error("❌ KAKAO REST API KEY IS UNDEFINED");
    return;
  }

  const authUrl =
    "https://kauth.kakao.com/oauth/authorize" +
    "?response_type=code" +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  console.log("KAKAO AUTH URL:", authUrl);

  // 🔥 무조건 시스템 브라우저
  Linking.openURL(authUrl);
}
