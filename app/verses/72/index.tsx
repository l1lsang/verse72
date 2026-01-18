import { verseGroups } from "@/src/data/verseGroups";
import { useTheme } from "@/src/theme/ThemeProvider";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function SeventyTwoGroups() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: colors.text,
        }}
      >
        72구절
      </Text>

      {verseGroups.map((group) => (
        <Pressable
          key={group.key}
          style={{ marginTop: 16 }}
          onPress={() =>
            router.push(`/verses/72/${group.key}`)
          }
        >
          <Text
            style={{
              fontSize: 18,
              color: colors.text,
            }}
          >
            📂 {group.key} · {group.title}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: colors.subText,
              marginTop: 4,
            }}
          >
            {group.description}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
