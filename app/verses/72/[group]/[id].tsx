import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";

import { verses72 } from "@/src/data/verses72";
import {
  checkMemorizedFromFirebase,
  removeMemorizedFromFirebase,
  saveMemorizedToFirebase,
} from "@/src/storage/memorize.firebase";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function VerseDetail() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  /* =========================
     📍 최초 진입 index
     ========================= */
  const initialIndex = useMemo(() => {
    const idx = verses72.findIndex((v) => v.id === id);
    return idx === -1 ? 0 : idx;
  }, [id]);

  /* =========================
     ✅ 상태: index만 단일 소스
     ========================= */
  const [currentIndex, setCurrentIndex] =
    useState(initialIndex);
  const verse = verses72[currentIndex];

  const [hidden, setHidden] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isMemorized, setIsMemorized] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
     🔇 화면 이탈 시 음성 정지
     ========================= */
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  /* =========================
     🔍 외운 말씀 여부 확인
     ========================= */
  useEffect(() => {
    if (!verse) return;

    setLoading(true);

    const check = async () => {
      try {
        const exists = await checkMemorizedFromFirebase(
          verse.id
        );
        setIsMemorized(exists);
      } catch (e) {
        console.log("🔥 memorized check error", e);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [verse]);

  /* =========================
     🔊 말씀 읽기
     ========================= */
  const speak = () => {
    if (!verse) return;

    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    Speech.speak(verse.text, {
      language: "ko-KR",
      rate: 0.9,
      pitch: 1.0,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  /* =========================
     🔁 외웠어요 ↔ 못 외웠어요
     ========================= */
  const onToggleMemorized = async () => {
    if (!verse || loading) return;
    setLoading(true);

    try {
      if (!isMemorized) {
        await saveMemorizedToFirebase({
          id: verse.id,
          reference: verse.reference,
          text: verse.text,
        });

        Alert.alert(
          "저장 완료 🙏",
          "이 말씀이 기억되었어요."
        );
        setIsMemorized(true);
      } else {
        await removeMemorizedFromFirebase(verse.id);

        Alert.alert(
          "괜찮아요 🤍",
          "다시 천천히 외워볼게요."
        );
        setIsMemorized(false);
      }
    } catch (e) {
      Alert.alert("오류", "처리 중 문제가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     🧭 렌더
     ========================= */
  return (
    <PagerView
      style={{ flex: 1 }}
      initialPage={initialIndex}
      onPageSelected={(e) => {
        const nextIndex = e.nativeEvent.position;

        // 🔄 페이지 전환 시 상태 초기화
        Speech.stop();
        setSpeaking(false);
        setHidden(false);

        // ✅ index만 변경 (라우팅 ❌)
        setCurrentIndex(nextIndex);
      }}
    >
      {verses72.map((v) => (
        <View
          key={v.id}
          style={[
            styles.container,
            { backgroundColor: colors.background },
          ]}
        >
          {/* 말씀 테마 */}
          <Text
            style={[
              styles.theme,
              { color: colors.subText },
            ]}
          >
            {v.theme}
          </Text>

          {/* 말씀 장절 */}
          <Text
            style={[
              styles.reference,
              { color: colors.text },
            ]}
          >
            {v.reference}
          </Text>

          {/* 말씀 카드 */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card },
            ]}
          >
            {hidden ? (
              <BlurView intensity={60} style={styles.blur}>
                <Text style={{ color: colors.subText }}>
                  말씀을 외워보세요 🙏
                </Text>
              </BlurView>
            ) : (
              <Text
                style={[
                  styles.text,
                  { color: colors.text },
                ]}
              >
                {v.text}
              </Text>
            )}
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttons}>
            {/* 🔊 듣기 */}
            <Pressable
              style={[
                styles.voiceButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={speak}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: "#fff" },
                ]}
              >
                {speaking ? "⏹ 중지" : "🔊 듣기"}
              </Text>
            </Pressable>

            {/* 🙈 가리기 */}
            <Pressable
              style={[
                styles.hideButton,
                { backgroundColor: colors.card },
              ]}
              onPress={() =>
                setHidden((prev) => !prev)
              }
            >
              <Text
                style={[
                  styles.hideText,
                  { color: colors.text },
                ]}
              >
                {hidden
                  ? "🙈 가리기 해제"
                  : "🙊 가리기"}
              </Text>
            </Pressable>

            {/* ✅ 외웠어요 */}
            <Pressable
              disabled={loading}
              style={[
                styles.memorizedButton,
                {
                  backgroundColor: isMemorized
                    ? colors.card
                    : colors.success,
                  opacity: loading ? 0.6 : 1,
                },
              ]}
              onPress={onToggleMemorized}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: isMemorized
                      ? colors.text
                      : "#fff",
                  },
                ]}
              >
                {isMemorized
                  ? "↩ 못 외웠어요"
                  : "✅ 외웠어요"}
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  theme: {
    fontSize: 14,
    marginBottom: 6,
  },
  reference: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
  },
  card: {
    minHeight: 180,
    padding: 20,
    borderRadius: 16,
    justifyContent: "center",
    overflow: "hidden",
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
  voiceButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  hideButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  memorizedButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  hideText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
