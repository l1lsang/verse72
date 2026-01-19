import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";

import { syncUserToFirestore } from "@/src/auth/syncUser"; // 🔥 추가
import { auth } from "@/src/config/firebase";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function SignupScreen() {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signup = async () => {
    const safeEmail = email.trim(); // ✅ 이메일만 trim

    // ===============================
    // 🔎 기본 검증
    // ===============================
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

    try {
      // ===============================
      // ✨ Firebase Auth 회원가입
      // ===============================
      await createUserWithEmailAndPassword(
        auth,
        safeEmail,
        password
      );

      // ===============================
      // 📄 Firestore 사용자 문서 동기화
      // ===============================
      await syncUserToFirestore({
        provider: "email",
      });

      // ===============================
      // 🚀 홈으로 이동
      // ===============================
      router.replace("/");
    } catch (e: any) {
      console.error("🔥 SIGNUP ERROR:", e);
      Alert.alert(
        "회원가입 실패",
        e?.message ?? "회원가입 중 오류가 발생했습니다."
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
        회원가입
      </Text>

      {/* 이메일 */}
      <TextInput
        placeholder="이메일"
        placeholderTextColor={colors.subText}
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* 비밀번호 */}
      <TextInput
        placeholder="비밀번호 (6자 이상)"
        placeholderTextColor={colors.subText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />

      {/* 비밀번호 확인 */}
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
        style={[
          styles.button,
          { backgroundColor: colors.primary },
        ]}
        onPress={signup}
      >
        <Text style={styles.buttonText}>
          가입하기
        </Text>
      </Pressable>
    </View>
  );
}
