import { StyleSheet, Text, View } from "react-native";

export default function Romans8Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>로마서 8장</Text>

      <View style={styles.box}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.text}>
          로마서 8장은 현재 개발 중이에요
        </Text>
        <Text style={styles.sub}>
          말씀 암송 기능 완성 후 곧 추가될 예정입니다 🙏
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  box: {
    marginTop: 40,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  emoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  sub: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
