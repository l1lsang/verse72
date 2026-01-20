import {
  getProfile,
  loginWithKakaoAccount,
} from "@react-native-kakao/user";

export async function kakaoNativeLogin() {
  try {
    // ✅ 카카오 로그인 (카카오톡 → 계정 자동 fallback)
    const token = await loginWithKakaoAccount();
    console.log("🟡 카카오 토큰:", token);

    // (선택) 사용자 프로필
    const profile = await getProfile();
    console.log("🟢 카카오 프로필:", profile);

    return {
      token,
      profile,
    };
  } catch (e) {
    console.error("🔥 카카오 로그인 실패", e);
    throw e;
  }
}
