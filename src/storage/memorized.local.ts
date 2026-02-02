import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "memorized_ids";

/* =========================
   📥 로컬에서 외운 말씀 불러오기
   ========================= */
export async function loadLocalMemorized(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);

    if (!raw) {
      // 저장된 게 없으면 빈 Set
      return new Set();
    }

    const parsed = JSON.parse(raw);

    // ✅ 배열인지 방어
    if (!Array.isArray(parsed)) {
      return new Set();
    }

    return new Set(parsed);
  } catch (e) {
    console.error("⚠️ loadLocalMemorized failed:", e);
    return new Set();
  }
}

/* =========================
   💾 로컬에 외운 말씀 저장
   (초기화 포함)
   ========================= */
export async function saveLocalMemorized(
  ids?: Set<string>
) {
  try {
    // ✅ 초기화 or 잘못된 값 방어
    if (!ids) {
      await AsyncStorage.removeItem(KEY);
      return;
    }

    await AsyncStorage.setItem(
      KEY,
      JSON.stringify([...ids])
    );
  } catch (e) {
    console.error("⚠️ saveLocalMemorized failed:", e);
  }
}
