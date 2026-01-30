import {
    getMemorizedSetFromFirebase,
    saveMemorizedSetToFirebase,
} from "./memorize.firebase";

export async function syncFromFirebase(): Promise<Set<string>> {
  return await getMemorizedSetFromFirebase();
}

export async function saveMemorizedToFirebase(
  ids: Set<string>
) {
  await saveMemorizedSetToFirebase(ids);
}
