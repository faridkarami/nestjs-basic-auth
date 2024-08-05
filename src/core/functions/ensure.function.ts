export function ensure<T>(
  option: T | undefined,
  defaultValue?: T,
): (req?: any) => T {
  if (option === undefined) {
    return () => defaultValue as T;
  }

  if (typeof option !== 'function') {
    return () => option;
  }

  return option as (req?: any) => T;
}
