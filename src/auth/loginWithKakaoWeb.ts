import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// 🔥 이 줄이 없으면 "로그인 취소" 많이 뜸
WebBrowser.maybeCompleteAuthSession();

const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_KEY!;

export async function kakaoWebLogin() {
  // ✅ app.json의 scheme 기반 redirectUri 생성
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "verse72",
  });

  const authUrl =
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  const result = await AuthSession.startAsync({
    authUrl,
  });

  if (result.type !== "success") {
    throw new Error("카카오 로그인 취소");
  }

  const code = result.params?.code;

  if (!code) {
    throw new Error("카카오 인가 코드 없음");
  }

  return code;
}
