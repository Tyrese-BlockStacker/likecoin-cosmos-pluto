import * as Base64 from '@protobufjs/base64';

export function generateFileAndDownload(content: string, filename: string) {
  const a = document.createElement('a');
  const blob = new Blob([content]);
  const url = URL.createObjectURL(blob);
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
  a.parentElement?.removeChild(a);
}

export function selectAndImportFiles(isMultiple: boolean = true): Promise<string[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    if (isMultiple) {
      input.setAttribute('multiple', '1');
    }
    input.onchange = async (e) => {
      const promises = [] as Promise<string>[];
      for (let i = 0; i < input.files!.length; i += 1) {
        const file = input.files![i] as File;
        promises.push(file.text());
      }
      resolve(await Promise.all(promises));
    };
    input.click();
    input.parentElement?.removeChild(input);
  });
}

export function selectAndImportFile(): Promise<string> {
  return selectAndImportFiles(false).then((arr) => arr[0]);
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

export function encodeBase64(buf: Uint8Array) {
  return Base64.encode(buf, 0, buf.length)
}

export function decodeBase64(input: string) {
  const buf = new Uint8Array(Base64.length(input));
  Base64.decode(input, buf, 0);
  return buf;
}

export function IsSameUint8Array(x: Uint8Array, y: Uint8Array) {
  if (x.length !== y.length) {
    return false;
  }
  return x.every((b, i) => b === y[i]);
}

export function isBech32(s: string) {
  return /^[\x21-\x7E]{1,83}1[ac-hj-np-z02-9]{6,}$/.test(s);
}
