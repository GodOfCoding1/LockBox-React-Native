import * as SecureStore from "expo-secure-store";

export async function saveToLocal(key: string, value: any) {
  await SecureStore.setItemAsync(key, value);
}

export async function deleteFromLocal(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export function getValueFromLocal(key: string) {
  let result = SecureStore.getItem(key);
  return result;
}
