import { router } from "expo-router";
import {
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

import { loginWithKakaoWeb } from "@/src/auth/loginWithKakaoWeb"; // 🟡 카카오 웹 로그인
import { auth } from "@/src/config/firebase";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function LoginScreen() {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // ✉️ 이메일 로그인
  // ===============================
  const loginWithEmail = async () => {
    const safeEmail = email.trim();

    if (!safeEmail || !password) {
      Alert.alert("입력 오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        safeEmail,
        password
      );

      // ✅ Auth 상태 변경 → RootLayout에서 자동 이동

    } catch (e: any) {
      console.error("🔥 EMAIL LOGIN ERROR:", e?.code, e?.message);

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

  // ===============================
  // 🟡 카카오 웹 로그인
  // ===============================
  const loginWithKakao = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // ✅ 여기서는 "브라우저 열기"까지만
      await loginWithKakaoWeb();

      // 🔥 실제 Firebase 로그인은
      // 딥링크(verse72://login?token=...)를
      // 받는 쪽(RootLayout/App.tsx)에서 처리됨

    } catch (e: any) {
      console.error("🔥 KAKAO WEB LOGIN ERROR:", e);
      Alert.alert(
        "카카오 로그인 실패",
        e?.message ?? "카카오 로그인 중 오류가 발생했습니다."
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

      <Pressable
        disabled={loading}
        style={[
          styles.kakaoButton,
          { opacity: loading ? 0.6 : 1 },
        ]}
        onPress={loginWithKakao}
      >
        <Text style={styles.kakaoButtonText}>
          카카오로 로그인
        </Text>
      </Pressable>

      {/* 👇 회원가입 */}
      <Text
        style={{
          textAlign: "center",
          marginTop: 20,
          color: colors.subText,
          fontSize: 13,
        }}
      >
        아직 계정이 없으신가요?
      </Text>

      <Pressable
        disabled={loading}
        onPress={() => router.push("/signup")}
        style={{ marginTop: 6 }}
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
