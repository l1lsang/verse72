import { verseGroups } from "@/src/data/verseGroups";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SeventyTwoGroups() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* ⬅️ 뒤로가기 버튼 */}
      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          padding: 8,
          borderRadius: 20,
          backgroundColor: colors.card,
        }}
        hitSlop={10}
      >
        <Ionicons
          name="chevron-back"
          size={26}
          color={colors.text}
        />
      </Pressable>

      {/* 제목 */}
      <Text style={[styles.title, { color: colors.text }]}>
        72구절
      </Text>

      {/* 그룹 카드 */}
      {verseGroups.map((group) => (
        <Pressable
          key={group.key}
          onPress={() =>
            router.push(`/verses/72/${group.key}`)
          }
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.96 : 1,
              transform: [
                { scale: pressed ? 0.985 : 1 },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            {group.key}
          </Text>

          <Text
            style={[
              styles.cardSubtitle,
              { color: colors.text },
            ]}
          >
            {group.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 56, // ✅ 겹침 방지 핵심
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },

  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },

  cardSubtitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },

  cardDesc: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});
