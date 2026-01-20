import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// 🔥 이 줄 없으면 로그인 완료 후 앱 복귀가 안 됨
WebBrowser.maybeCompleteAuthSession();

const KAKAO_REST_API_KEY =
  process.env.EXPO_PUBLIC_KAKAO_REST_KEY!;

export async function kakaoWebLogin() {
  // ✅ app.json의 scheme 기반 redirectUri
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "verse72",
  });

  const authUrl =
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  // 🔥 여기 핵심 변경
  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    redirectUri
  );

  if (result.type !== "success") {
    throw new Error("카카오 로그인 취소");
  }

  // 🔑 redirectUri로 돌아온 URL에서 code 파싱
  const url = result.url;
  const params = new URL(url).searchParams;
  const code = params.get("code");

  if (!code) {
    throw new Error("카카오 인가 코드 없음");
  }

  return code;
}
