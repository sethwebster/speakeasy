export function inspect<T>(item: T, label: string): T {
  console.log(label, item);
  return item;
}
