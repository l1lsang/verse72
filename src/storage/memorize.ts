import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "memorizedVerses";

export type MemorizedVerse = {
  id: string;           // A-1
  reference: string;    // 요 3:16
  text: string;
  memorizedAt: number;  // timestamp
};

// 가져오기
export async function getMemorized(): Promise<MemorizedVerse[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

// 저장
export async function saveMemorized(verse: MemorizedVerse) {
  const prev = await getMemorized();
  const next = [
    verse,
    ...prev.filter(v => v.id !== verse.id),
  ];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
