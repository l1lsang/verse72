import {
    loadLocalMemorized,
    saveLocalMemorized,
} from "@/src/storage/memorized.local";
import { syncFromFirebase } from "@/src/storage/memorized.sync";
import { createContext, useContext, useEffect, useState } from "react";

type Ctx = {
  memorized: Set<string>;
  toggle: (id: string) => Promise<Set<string>>;
  ready: boolean;
};

const MemorizedContext = createContext<Ctx>(null as any);

export function MemorizedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [memorized, setMemorized] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // 1️⃣ 로컬 먼저 로드 (🔥 진실의 원천)
      const local = await loadLocalMemorized();
      if (!mounted) return;

      setMemorized(local);

      // 2️⃣ 로컬이 비어 있을 때만 Firebase 복원
      if (local.size === 0) {
        const remote = await syncFromFirebase();
        if (!mounted) return;

        if (remote.size > 0) {
          setMemorized(remote);
          await saveLocalMemorized(remote);
        }
      }

      // 3️⃣ 준비 완료
      setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggle = async (id: string): Promise<Set<string>> => {
    let next!: Set<string>;

    setMemorized((prev) => {
      next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    // ✅ 로컬 저장 (항상 최신 유지)
    await saveLocalMemorized(next);

    return next;
  };

  return (
    <MemorizedContext.Provider value={{ memorized, toggle, ready }}>
      {children}
    </MemorizedContext.Provider>
  );
}

export const useMemorized = () => {
  const ctx = useContext(MemorizedContext);
  if (!ctx) {
    throw new Error(
      "useMemorized must be used within MemorizedProvider"
    );
  }
  return ctx;
};
