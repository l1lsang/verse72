import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const KAKAO_REST_API_KEY =
  process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!;

const REDIRECT_URI =
  "https://72-self.vercel.app/auth/kakao/callback";

/**
 * 카카오 웹 로그인 → 인가 코드 반환
 */
export async function kakaoWebLogin(): Promise<string> {
  const authUrl =
    `https://kauth.kakao.com/oauth/authorize` +
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

  const url = result.url;
  const code = new URL(url).searchParams.get("code");

  if (!code) {
    throw new Error("인가 코드 없음");
  }

  return code;
}
