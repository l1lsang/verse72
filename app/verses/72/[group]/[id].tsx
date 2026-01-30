import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";

import { useMemorized } from "@/src/context/MemorizedContext";
import { verses72 } from "@/src/data/verses72";
import { useTheme } from "@/src/theme/ThemeProvider";

const TOTAL = 72;

export default function VerseDetail() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { memorized, toggle, ready } = useMemorized();

  /* ======================
     🔥 엔딩 감지 (핵심)
     ====================== */
  useEffect(() => {
    if (!ready) return;

    if (memorized.size === TOTAL) {
      const timer = setTimeout(() => {
        router.replace("/(ending)");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [memorized.size, ready]);

  /* ======================
     기본 상태
     ====================== */
  const initialIndex = useMemo(() => {
    const idx = verses72.findIndex((v) => v.id === id);
    return idx === -1 ? 0 : idx;
  }, [id]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const verse = verses72[currentIndex];

  const [hidden, setHidden] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const isMemorized = verse ? memorized.has(verse.id) : false;

  /* ================= 애니메이션 ================= */
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const borderOpacity = useRef(new Animated.Value(0)).current;

  /* 그룹 완료 */
  const [completedGroup, setCompletedGroup] =
    useState<string | null>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const groupScale = useRef(new Animated.Value(0.8)).current;

  /* 음성 중단 */
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

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
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  /* ✨ 외웠어요 연출 */
  const playMemorizedEffect = () => {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.12,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    checkAnim.setValue(0);
    Animated.sequence([
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(checkAnim, {
        toValue: 0,
        duration: 300,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(borderOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(borderOpacity, {
        toValue: 0,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* 그룹 완료 체크 */
  const getCompletedGroup = () => {
    if (!verse) return null;
    const groupKey = verse.group;
    const versesInGroup = verses72.filter(
      (v) => v.group === groupKey
    );

    const allDone = versesInGroup.every((v) =>
      memorized.has(v.id)
    );

    return allDone ? groupKey : null;
  };

  const playGroupCompleteEffect = (group: string) => {
    setCompletedGroup(group);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(groupScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <>
      <PagerView
        style={{ flex: 1 }}
        initialPage={initialIndex}
        onPageSelected={(e) => {
          Speech.stop();
          setSpeaking(false);
          setHidden(false);
          setCurrentIndex(e.nativeEvent.position);
        }}
      >
        {verses72.map((v) => (
          <View
            key={v.id}
            style={[styles.container, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.reference, { color: colors.text }]}>
              {v.reference}
            </Text>

            <Animated.View
              style={[
                styles.card,
                { backgroundColor: colors.card },
              ]}
            >
              <Text style={[styles.text, { color: colors.text }]}>
                {v.text}
              </Text>
            </Animated.View>

            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: isMemorized
                    ? colors.card
                    : colors.success,
                },
              ]}
              onPress={async () => {
                if (!verse) return;
                playMemorizedEffect();
                await toggle(verse.id);

                const g = getCompletedGroup();
                if (g) playGroupCompleteEffect(g);
              }}
            >
              <Text
                style={{
                  color: isMemorized ? colors.text : "#fff",
                  fontWeight: "600",
                }}
              >
                {isMemorized ? "↩ 못 외웠어요" : "✅ 외웠어요"}
              </Text>
            </Pressable>
          </View>
        ))}
      </PagerView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  reference: { fontSize: 20, fontWeight: "700", marginBottom: 24 },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  text: { fontSize: 18, lineHeight: 28 },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
