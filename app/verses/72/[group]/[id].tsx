import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
const TOP_OFFSET = 56; // container paddingTop과 동일
export default function VerseDetail() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { memorized, toggle, ready } = useMemorized();

  /* ================= 초기 페이지 ================= */
  const initialIndex = useMemo(() => {
    const idx = verses72.findIndex((v) => v.id === id);
    return idx === -1 ? 0 : idx;
  }, [id]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const verse = verses72[currentIndex];
  const isMemorized = verse ? memorized.has(verse.id) : false;

  const [hidden, setHidden] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  /* ================= 애니메이션 ================= */
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const borderOpacity = useRef(new Animated.Value(0)).current;

  /* 그룹 완료 */
  const [completedGroup, setCompletedGroup] =
    useState<string | null>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const groupScale = useRef(new Animated.Value(0.85)).current;

  /* ================= 음성 정리 ================= */
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

  /* ================= 외웠어요 연출 ================= */
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

  /* ================= 그룹 완료 ================= */
  const getCompletedGroup = (next: Set<string>) => {
    if (!verse) return null;

    const groupKey = verse.group;
    const versesInGroup = verses72.filter(
      (v) => v.group === groupKey
    );

    const allDone = versesInGroup.every((v) =>
      next.has(v.id)
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
      {/* ⬅️ 뒤로가기 버튼 */}
      <Pressable
        onPress={() => {
          Speech.stop();
          router.back();
        }}
        style={{
          position: "absolute",
          top: 4,
          left: 12,
          zIndex: 200,
          padding: 8,
          borderRadius: 20,
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
        hitSlop={10}
      >
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </Pressable>

      {/* 🌈 테두리 연출 */}
      <Animated.View
  pointerEvents="none"
  style={[
    {
      position: "absolute",
      top: TOP_OFFSET,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: borderOpacity,
    },
  ]}
>
  <LinearGradient
    colors={[
      "rgba(255,215,130,0.9)",
      "rgba(255,180,120,0.6)",
      "rgba(255,215,130,0.9)",
    ]}
    style={{ flex: 1, borderWidth: 6 }}
  />
</Animated.View>


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
            style={[
              styles.container,
              { backgroundColor: colors.background },
            ]}
          >
            {/* 🌿 theme + id */}
            <View style={styles.metaRow}>
              <Text style={[styles.theme, { color: colors.subText }]}>
                {v.theme}
              </Text>
              <Text style={[styles.id, { color: colors.subText }]}>
                {v.id}
              </Text>
            </View>

            {/* 📖 reference */}
            <Text
              style={[styles.reference, { color: colors.text }]}
            >
              {v.reference}
            </Text>

            {/* 카드 */}
            <View style={{ position: "relative" }}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.cardGlow,
                  {
                    opacity: glowAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <Animated.Text
                  style={[
                    styles.check,
                    {
                      opacity: checkAnim,
                      transform: [
                        {
                          scale: checkAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  ✅
                </Animated.Text>

                {hidden ? (
                  <BlurView intensity={60} style={styles.blur}>
                    <Text style={{ color: colors.subText }}>
                      말씀을 외워보세요 🙏
                    </Text>
                  </BlurView>
                ) : (
                  <Text
                    style={[styles.text, { color: colors.text }]}
                  >
                    {v.text}
                  </Text>
                )}
              </Animated.View>
            </View>

            {/* 버튼 */}
            <View style={styles.buttons}>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: colors.card },
                ]}
                onPress={() => setHidden((h) => !h)}
              >
                <Text style={{ color: colors.text }}>
                  {hidden ? "👀 말씀 보기" : "🙈 말씀 가리기"}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: colors.primary },
                ]}
                onPress={speak}
              >
                <Text style={{ color: "#fff" }}>
                  {speaking ? "⏹ 중지" : "🔊 듣기"}
                </Text>
              </Pressable>

              {ready ? (
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
                    const next = await toggle(verse.id);

                    const g = getCompletedGroup(next);
                    if (g) playGroupCompleteEffect(g);

                    if (next.size === TOTAL) {
                      setTimeout(() => {
                        router.replace("/(ending)");
                      }, 1200);
                    }
                  }}
                >
                  <Text
                    style={{
                      color: isMemorized
                        ? colors.text
                        : "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {isMemorized
                      ? "↩ 못 외웠어요"
                      : "✅ 외웠어요"}
                  </Text>
                </Pressable>
              ) : (
                <View
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.card,
                      opacity: 0.4,
                    },
                  ]}
                >
                  <Text style={{ color: colors.subText }}>
                    상태 불러오는 중…
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </PagerView>

      {/* 🌟 그룹 완료 오버레이 */}
      {completedGroup && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: "rgba(0,0,0,0.55)",
              justifyContent: "center",
              alignItems: "center",
              opacity: overlayOpacity,
              zIndex: 100,
            },
          ]}
        >
          <Pressable
            style={{ alignItems: "center", padding: 24 }}
            onPress={() => {
              setCompletedGroup(null);
              overlayOpacity.setValue(0);
              groupScale.setValue(0.85);
            }}
          >
            <Animated.Text
              style={{
                fontSize: 96,
                fontWeight: "900",
                color: "#fff",
                transform: [{ scale: groupScale }],
              }}
            >
              {completedGroup}
            </Animated.Text>

            <Text style={styles.groupTitle}>파트 완주 🎉</Text>

            <Text style={styles.groupDesc}>
              여기까지 오느라 정말 수고했어요.
              {"\n"}
              이 말씀들이 이제 당신 안에 살아 있습니다.
            </Text>

            <Text style={styles.groupHint}>
              화면을 눌러 계속하기
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24,paddingTop: 56 },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  theme: { fontSize: 14 },
  id: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.6,
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
  },

  cardGlow: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 24,
    backgroundColor: "rgba(255,200,120,0.25)",
  },

  check: {
    position: "absolute",
    top: -18,
    right: -8,
    fontSize: 32,
  },

  text: { fontSize: 18, lineHeight: 28 },

  blur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },

  buttons: { marginTop: 24, gap: 12 },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  groupTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  groupDesc: {
    marginTop: 16,
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
  },

  groupHint: {
    marginTop: 24,
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
});
