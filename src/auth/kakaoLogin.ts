import {
  getProfile,
  login,
} from "@react-native-kakao/user";

export async function kakaoNativeLogin() {
  try {
    // 카카오 로그인 (자동으로 카카오톡 → 계정 fallback 처리됨)
    const token = await login();
    console.log("카카오 토큰:", token);

    const profile = await getProfile();
    console.log("카카오 프로필:", profile);

    return { token, profile };
  } catch (e) {
    console.error("카카오 로그인 실패", e);
    throw e;
  }
}
