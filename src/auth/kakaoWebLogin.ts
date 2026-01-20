import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

// 🔥 로그인 완료 후 앱 복귀 필수
WebBrowser.maybeCompleteAuthSession();

const KAKAO_REST_API_KEY =
  process.env.EXPO_PUBLIC_KAKAO_REST_KEY!;

export async function loginWithKakaoWeb() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "verse72",
    path: "login",
  });

  const authUrl =
    "https://kauth.kakao.com/oauth/authorize" +
    `?response_type=code` +
    `&client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    redirectUri
  );

  if (result.type !== "success") {
    throw new Error("카카오 로그인 취소");
  }

  // ✅ React Native 방식으로 URL 파싱
  const parsed = Linking.parse(result.url);
  const code = parsed.queryParams?.code;

  if (!code || typeof code !== "string") {
    throw new Error("카카오 인가 코드 없음");
  }

  return code;
}
