import { router } from "expo-router";
import { signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { auth } from "@/src/config/firebase";
import { useTheme } from "@/src/theme/ThemeProvider";

// ✅ 카카오 네이티브 SDK
import { login as kakaoLogin } from "@react-native-kakao/user";

export default function LoginScreen() {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     ✉️ 이메일 로그인
     =============================== */
  const loginWithEmail = async () => {
    const safeEmail = email.trim();

    if (!safeEmail || !password) {
      Alert.alert("입력 오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, safeEmail, password);

      // 🔥 루트로 이동 → _layout.tsx에서 Auth 상태 재평가
      router.replace("/");
    } catch (e: any) {
      let message = "이메일 로그인에 실패했습니다.";

      switch (e?.code) {
        case "auth/user-not-found":
          message = "존재하지 않는 계정입니다.";
          break;
        case "auth/wrong-password":
          message = "비밀번호가 올바르지 않습니다.";
          break;
        case "auth/invalid-email":
          message = "이메일 형식이 올바르지 않습니다.";
          break;
        case "auth/too-many-requests":
          message =
            "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
          break;
      }

      Alert.alert("로그인 실패", message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     🟡 카카오 로그인
     (네이티브 SDK → 서버 → Firebase)
     =============================== */
  const loginWithKakao = async () => {
    if (loading) return;

    try {
      setLoading(true);

      /* 1️⃣ 카카오 네이티브 로그인 */
      const kakaoToken = await kakaoLogin();
      const kakaoAccessToken = kakaoToken.accessToken;

      if (!kakaoAccessToken) {
        throw new Error("No Kakao access token");
      }

      /* 2️⃣ 서버에 Kakao accessToken 전달 */
      const res = await fetch(
        "https://72-3.vercel.app/auth/kakao",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kakaoAccessToken,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Server authentication failed");
      }

      const { customToken } = await res.json();

      if (!customToken) {
        throw new Error("No Firebase custom token");
      }

      /* 3️⃣ Firebase Custom Token 로그인 */
      await signInWithCustomToken(auth, customToken);

      // 🔁 루트로 이동
      router.replace("/");
    } catch (e: any) {
      console.error("🔥 KAKAO LOGIN ERROR:", e);

      // 사용자가 취소한 경우는 조용히 종료
      if (e?.message?.includes("cancel")) return;

      Alert.alert(
        "카카오 로그인 실패",
        "카카오 로그인 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        로그인
      </Text>

      {/* 이메일 입력 */}
      <TextInput
        placeholder="이메일"
        placeholderTextColor={colors.subText}
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text },
        ]}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* 비밀번호 입력 */}
      <TextInput
        placeholder="비밀번호"
        placeholderTextColor={colors.subText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text },
        ]}
      />

      {/* ✉️ 이메일 로그인 */}
      <Pressable
        disabled={loading}
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
            opacity: loading ? 0.6 : 1,
          },
        ]}
        onPress={loginWithEmail}
      >
        <Text style={styles.buttonText}>
          {loading ? "로그인 중..." : "로그인"}
        </Text>
      </Pressable>

      <Text
        style={{
          textAlign: "center",
          marginVertical: 16,
          color: colors.subText,
        }}
      >
        또는
      </Text>

      {/* 🟡 카카오 로그인 */}
      <Pressable
        disabled={loading}
        onPress={loginWithKakao}
        style={[
          styles.kakaoButton,
          { opacity: loading ? 0.6 : 1 },
        ]}
      >
        <Text style={styles.kakaoButtonText}>
          카카오로 로그인
        </Text>
      </Pressable>

      {/* 회원가입 */}
      <Pressable
        onPress={() => router.push("/signup")}
        style={{ marginTop: 24 }}
      >
        <Text
          style={{
            textAlign: "center",
            color: colors.primary,
            fontWeight: "600",
          }}
        >
          회원가입
        </Text>
      </Pressable>
    </View>
  );
}

/* ===============================
   🎨 스타일
   =============================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  kakaoButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});
