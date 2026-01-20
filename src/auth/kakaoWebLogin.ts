import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// 🔥 로그인 완료 후 앱으로 정상 복귀시키는 필수 코드
WebBrowser.maybeCompleteAuthSession();

const KAKAO_REST_API_KEY =
  process.env.EXPO_PUBLIC_KAKAO_REST_KEY!;

export async function kakaoWebLogin() {
  // ✅ 커스텀 스킴 + path 명시 (중요)
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "verse72",
    path: "login", // 👈 꼭 필요
  });

  const authUrl =
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  // ✅ 웹 로그인 세션 시작
  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    redirectUri
  );

  if (result.type !== "success") {
    throw new Error("카카오 로그인 취소");
  }

  // 🔑 redirectUri로 돌아온 URL에서 code 추출
  const returnedUrl = result.url;
  const params = new URL(returnedUrl).searchParams;
  const code = params.get("code");

  if (!code) {
    throw new Error("카카오 인가 코드 없음");
  }

  return code;
}
