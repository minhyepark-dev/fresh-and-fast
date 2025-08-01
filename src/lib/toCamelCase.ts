// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }

  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
      acc[camelKey] = toCamelCase(value);
      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);
  }

  return obj;
}
export default toCamelCase;
