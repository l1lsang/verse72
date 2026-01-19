import { verseGroups } from "@/src/data/verseGroups";
import { useTheme } from "@/src/theme/ThemeProvider";
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
          {/* 카드 상단 */}
          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            {group.key}
          </Text>

          {/* 카드 메인 */}
          <Text
            style={[
              styles.cardSubtitle,
              { color: colors.text },
            ]}
          >
            {group.title}
          </Text>

          {/* 설명 */}
          <Text
            style={[
              styles.cardDesc,
              { color: colors.subText },
            ]}
          >
            {group.description}
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
