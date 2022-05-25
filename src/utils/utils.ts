export function generateFileAndDownload(content: string, filename: string) {
  const a = document.createElement('a');
  const blob = new Blob([content]);
  const url = URL.createObjectURL(blob); // Create an object URL from blob
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}

function transformObjectKey<T>(fn: (arg0: string) => string, obj: T): T {
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((elem) => transformObjectKey(fn, elem)) as unknown as T;
  }
  const output = {} as any;
  for (const [key, value] of Object.entries(obj)) {
    const newKey = fn(key);
    const newValue = transformObjectKey(fn, value);
    output[newKey] = newValue;
  }
  return output;
}

export function snakeCaseToCamelCase(s: string): string {
  return s.replaceAll(/(?=.)_(.)/g, (_, c) => c.toUpperCase());
}

export function snakeCaseToCamelCaseObject<T>(obj: T): T {
  return transformObjectKey(snakeCaseToCamelCase, obj);
}

export function camelCaseToSnakeCase(s: string): string {
  return s.replaceAll(/(?=.)[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function camelCaseToSnakeCaseObject<T>(obj: T): T {
  return transformObjectKey(camelCaseToSnakeCase, obj);
}
