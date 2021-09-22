export default class StorageService {
  static get<T>(key: string): T | null {
    const value = localStorage.getItem(key);

    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  }

  static store(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
