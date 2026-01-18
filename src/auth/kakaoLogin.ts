import { UserApiClient } from "@react-native-kakao/user";

export async function kakaoNativeLogin() {
  // 카카오톡 설치 여부
  const isInstalled = await UserApiClient.isKakaoTalkLoginAvailable();

  if (isInstalled) {
    return await UserApiClient.loginWithKakaoTalk();
  } else {
    return await UserApiClient.loginWithKakaoAccount();
  }
}
