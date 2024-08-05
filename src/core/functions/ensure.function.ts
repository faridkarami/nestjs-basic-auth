export const ensure = <T>(
  option: T | undefined,
  defaultValue?: T,
): (() => T) => {
  if (option === undefined) {
    return () => defaultValue as T;
  }

  if (typeof option !== 'function') {
    return () => option;
  }

  return option as () => T;
};
