import { createUserWithEmailAndPassword } from "firebase/auth";
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

export default function SignupScreen() {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    const safeEmail = email.trim();

    // 🔎 기본 검증
    if (!safeEmail || !password || !confirmPassword) {
      Alert.alert("입력 오류", "모든 항목을 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "비밀번호 오류",
        "비밀번호는 6자 이상이어야 합니다."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "비밀번호 불일치",
        "비밀번호가 서로 일치하지 않습니다."
      );
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      // ✨ Firebase Auth 회원가입
      await createUserWithEmailAndPassword(
        auth,
        safeEmail,
        password
      );

      // ✅ 여기서 끝
      // → auth 상태 변경
      // → RootLayout이 자동으로 홈 이동

      Alert.alert("환영합니다 🙏", "회원가입이 완료되었습니다.");
    } catch (e: any) {
      console.error("🔥 SIGNUP ERROR:", e);
      Alert.alert(
        "회원가입 실패",
        e?.message ?? "회원가입 중 오류가 발생했습니다."
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
        회원가입
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
        placeholder="비밀번호 (6자 이상)"
        placeholderTextColor={colors.subText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text },
        ]}
      />

      <TextInput
        placeholder="비밀번호 확인"
        placeholderTextColor={colors.subText}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[
          styles.input,
          {
            borderColor:
              confirmPassword.length === 0
                ? colors.border
                : password === confirmPassword
                ? colors.success
                : "#e57373",
            color: colors.text,
          },
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
        onPress={signup}
      >
        <Text style={styles.buttonText}>
          {loading ? "가입 중..." : "가입하기"}
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
