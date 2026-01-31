import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

const KAKAO_REST_API_KEY =
  Constants.expoConfig?.extra?.KAKAO_REST_API_KEY;

const REDIRECT_URI = "https://72-3.vercel.app/auth/kakao";

export async function loginWithKakaoWeb() {
  if (!KAKAO_REST_API_KEY) {
    console.error("❌ KAKAO REST API KEY IS UNDEFINED");
    return;
  }

  const authUrl =
    "https://kauth.kakao.com/oauth/authorize" +
    "?response_type=code" +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  try {
    // ✅ OAuth 세션 유지 (카카오톡 → 다시 복귀 가능)
    await WebBrowser.openAuthSessionAsync(
      authUrl,
      REDIRECT_URI
    );
  } catch (e) {
    console.error("🔥 카카오 로그인 실패", e);
  }
}
