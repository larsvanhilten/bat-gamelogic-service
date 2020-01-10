export function appendParameters(fn: any, ...boundArgs: any) {
  return (...args: any) => {
    return fn(...args, ...boundArgs);
  };
}
