import { router } from "expo-router";
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

  const signup = async () => {
    // ✅ 1. 기본 검증
    if (!email || !password || !confirmPassword) {
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
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (e: any) {
      Alert.alert("회원가입 실패", e.message);
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
                : "#e57373", // ❌ 불일치 시 빨강
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
