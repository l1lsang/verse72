import { router } from "expo-router";
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { kakaoNativeLogin } from "@/src/auth/kakaoLogin";
import { syncUserToFirestore } from "@/src/auth/syncUser";
import { auth } from "@/src/config/firebase";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function LoginScreen() {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ===============================
  // ✉️ 이메일 로그인
  // ===============================
  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      await syncUserToFirestore({
        provider: "email",
      });

      router.replace("/");
    } catch (e: any) {
      Alert.alert(
        "로그인 실패",
        e?.message ?? "이메일 로그인에 실패했습니다."
      );
    }
  };

  // ===============================
  // 🟡 카카오 네이티브 로그인 (최종 안정판)
  // ===============================
  const loginWithKakao = async () => {
    try {
      console.log("🟡 [KAKAO] 네이티브 로그인 시작");

      // 1️⃣ 카카오 로그인
      const token = await kakaoNativeLogin();
      console.log("🟢 [KAKAO] token:", token);

      const accessToken = token?.accessToken;
      if (!accessToken) {
        throw new Error("카카오 accessToken 없음");
      }

      // 2️⃣ 서버 → Firebase Custom Token
      const res = await fetch(
        "https://72-self.vercel.app/api/auth/kakao",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
        }
      );

      const data = await res.json();
      if (!data?.customToken) {
        throw new Error("Firebase Custom Token 발급 실패");
      }

      // 3️⃣ Firebase 로그인
      await signInWithCustomToken(auth, data.customToken);

      // 4️⃣ Firestore 동기화
      await syncUserToFirestore({
        provider: "kakao",
      });

      router.replace("/");
    } catch (e: any) {
      console.error("🔥 [KAKAO LOGIN ERROR]", e);
      Alert.alert(
        "카카오 로그인 실패",
        e?.message ?? "알 수 없는 오류"
      );
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

      <Pressable
        style={[
          styles.button,
          { backgroundColor: colors.primary },
        ]}
        onPress={loginWithEmail}
      >
        <Text style={styles.buttonText}>로그인</Text>
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

      <Pressable
        style={styles.kakaoButton}
        onPress={loginWithKakao}
      >
        <Text style={styles.kakaoButtonText}>
          카카오로 로그인
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/signup")}>
        <Text style={[styles.link, { color: colors.primary }]}>
          회원가입
        </Text>
      </Pressable>
    </View>
  );
}

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
  link: {
    marginTop: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
