export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c, r = (Math.random() * 16) | 0) => (c === 'x' ? r : (r & 0x3) | 0x8).toString(16),
  );
}
