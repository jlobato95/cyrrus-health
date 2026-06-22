import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Obtém um item do localStorage e realiza o parse de JSON.
   * @param key Chave de busca configurada em STORAGE_KEYS.
   */
  public get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error(`[StorageService] Erro ao ler chave ${key}:`, error);
      return null;
    }
  }

  /**
   * Salva um item no localStorage convertendo-o para string JSON.
   * @param key Chave de armazenamento configurada em STORAGE_KEYS.
   * @param value Dado a ser persistido.
   */
  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[StorageService] Erro ao gravar chave ${key}:`, error);
    }
  }

  /**
   * Remove uma chave do localStorage.
   * @param key Chave configurada em STORAGE_KEYS.
   */
  public remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Erro ao remover chave ${key}:`, error);
    }
  }

  /**
   * Limpa todo o localStorage.
   */
  public clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[StorageService] Erro ao limpar o storage:', error);
    }
  }
}
