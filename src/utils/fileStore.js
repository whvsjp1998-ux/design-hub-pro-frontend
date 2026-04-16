const fileStore = new Map();

export function storeOriginalFile(fileName, file) {
  fileStore.set(fileName, file);
}

export function getOriginalFile(fileName) {
  return fileStore.get(fileName) || null;
}

export function hasOriginalFile(fileName) {
  return fileStore.has(fileName);
}

export function removeOriginalFile(fileName) {
  fileStore.delete(fileName);
}

export function clearAllFiles() {
  fileStore.clear();
}
