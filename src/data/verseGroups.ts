export type VerseGroup = "A" | "B" | "C" | "D" | "E" | "F";

export type VerseGroupMeta = {
  key: VerseGroup;
  title: string;       // 그룹 고유 이름
};

export const verseGroups: VerseGroupMeta[] = [
  {
    key: "A",
    title: "새로운 삶",
    
  },
  {
    key: "B",
    title: "그리스도를 전파함",
    
  },
  {
    key: "C",
    title: "하나님을 의뢰함",
    
  },
  {
    key: "D",
    title: "그리스도 제자의 자격",
    
  },
  {
    key: "E",
    title: "그리스도를 닮아감",
    
  },
  {
    key: "F",
    title: "온전한 인격",
    
  },
];
