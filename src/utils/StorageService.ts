export default class StorageService {
  static get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  static store(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
