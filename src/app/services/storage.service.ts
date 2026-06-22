import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // Pega um item do localStorage e converte de JSON
  public get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error(`[StorageService] Erro ao ler chave ${key}:`, error);
      return null;
    }
  }

  // Salva um item no localStorage convertendo para JSON
  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[StorageService] Erro ao gravar chave ${key}:`, error);
    }
  }

  // Remove um item do localStorage
  public remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Erro ao remover chave ${key}:`, error);
    }
  }

  // Limpa o localStorage
  public clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[StorageService] Erro ao limpar o storage:', error);
    }
  }
}

