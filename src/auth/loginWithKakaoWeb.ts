import { auth } from "@/src/config/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { kakaoWebLogin } from "./kakaoWebLogin";

export async function loginWithKakaoWeb() {
  // 1️⃣ 카카오 웹 로그인
  const code = await kakaoWebLogin();

  // 2️⃣ 서버에 code 전달
  const res = await fetch(
    "https://72-self.vercel.app/api/auth/kakao",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }
  );

  const data = await res.json();

  if (!data?.customToken) {
    throw new Error("Firebase Custom Token 발급 실패");
  }

  // 3️⃣ Firebase 로그인
  await signInWithCustomToken(auth, data.customToken);
}
