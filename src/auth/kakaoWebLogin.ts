import * as WebBrowser from "expo-web-browser";

// 🔥 웹 OAuth 완료 처리
WebBrowser.maybeCompleteAuthSession();

const KAKAO_REST_API_KEY =
  process.env.EXPO_PUBLIC_KAKAO_REST_KEY!;

// ✅ 반드시 서버와 동일한 웹 redirect URI
const REDIRECT_URI =
  "https://verse72.vercel.app/auth/kakao";

export async function loginWithKakaoWeb() {
  const authUrl =
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    REDIRECT_URI
  );

  if (result.type !== "success") {
    throw new Error("카카오 로그인 취소");
  }

  // ✅ 웹 URL 파싱
  const url = new URL(result.url);
  const code = url.searchParams.get("code");

  if (!code) {
    throw new Error("카카오 인가 코드 없음");
  }

  return code;
}
