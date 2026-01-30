import { useTheme } from "@/src/theme/ThemeProvider";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    BackHandler,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function EndingScreen() {
  const { colors } = useTheme();

  /* =========================
     🎬 애니메이션 값
     ========================= */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  /* =========================
     🔒 뒤로가기 차단 + 진입 연출
     ========================= */
  useEffect(() => {
    // 🔔 진입 햅틱 (조용하게)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 🔒 뒤로가기 막기
    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    // 🎬 페이드 + 슬라이드
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    return () => sub.remove();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        }}
      >
        {/* 🌿 엔딩 멘트 */}
        <Text style={[styles.text, { color: colors.text }]}>
          여기까지 오느라{"\n"}
          정말 수고 많았습니다.
        </Text>

        <View style={{ height: 24 }} />

        <Text style={[styles.text, { color: colors.text }]}>
          당신이 붙잡은 것은{"\n"}
          말씀이 아니라{"\n"}
          말씀 안에 계신 분이었습니다.
        </Text>

        <View style={{ height: 24 }} />

        <Text style={[styles.text, { color: colors.text }]}>
          이제 혼자가 아닙니다.{"\n"}
          이 길의 끝까지{"\n"}
          말씀은 함께 갈 것입니다.
        </Text>

        {/* 🌱 여백 */}
        <View style={{ height: 48 }} />

        {/* 🔘 버튼 */}
        <Pressable
          style={[
            styles.button,
            { backgroundColor: colors.card },
          ]}
          onPress={() => {
            router.replace("/mypage");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.text },
            ]}
          >
            마이페이지로 돌아가기
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
