import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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

      console.log("🟡 try email login");

      await signInWithEmailAndPassword(
        auth,
        safeEmail,
        password
      );

      console.log("🟢 email login success");

      // 🔥 핵심: 반드시 루트로 돌아가서
      // _layout.tsx가 user 상태를 다시 평가하게 함
      router.replace("/");

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

      <Pressable
        onPress={() => router.push("/signup")}
        style={{ marginTop: 20 }}
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
});
