import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { verseGroups } from "@/src/data/verseGroups";
import { verses72 } from "@/src/data/verses72";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function VerseListScreen() {
  const { colors } = useTheme();
  const { group } = useLocalSearchParams<{ group: string }>();

  const groupMeta = verseGroups.find((g) => g.key === group);
  const list = verses72.filter((v) => v.group === group);

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

      {/* 헤더 */}
      <Text style={[styles.title, { color: colors.text }]}>
        {groupMeta?.title ?? "말씀"}
      </Text>

      <Text style={[styles.sub, { color: colors.subText }]}>
        {list.length} 구절
      </Text>

      {/* 말씀 리스트 */}
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 24 }}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              { backgroundColor: colors.card },
            ]}
            onPress={() =>
              router.push(
                `/verses/72/${group}/${item.id}`
              )
            }
          >
            <Text
              style={[
                styles.reference,
                { color: colors.text },
              ]}
            >
              {item.reference}
            </Text>

            <Text
              style={[
                styles.text,
                { color: colors.subText },
              ]}
              numberOfLines={2}
            >
              {item.text}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 56, // ✅ 겹침 방지 핵심
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  sub: {
    marginTop: 4,
    fontSize: 14,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reference: {
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
});
