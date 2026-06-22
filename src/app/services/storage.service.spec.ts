import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get an item from localStorage (Arrange-Act-Assert)', () => {
    // Arrange
    const key = 'test_key';
    const value = { name: 'Leo Silva', age: '14 Meses' };

    // Act
    service.set(key, value);
    const retrieved = service.get<{ name: string; age: string }>(key);

    // Assert
    expect(retrieved).toEqual(value);
  });

  it('should return null when key does not exist', () => {
    // Act
    const retrieved = service.get('non_existent_key');

    // Assert
    expect(retrieved).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    // Arrange
    const key = 'test_key';
    service.set(key, 'some value');

    // Act
    service.remove(key);
    const retrieved = service.get(key);

    // Assert
    expect(retrieved).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    // Arrange
    service.set('key1', 'val1');
    service.set('key2', 'val2');

    // Act
    service.clear();

    // Assert
    expect(service.get('key1')).toBeNull();
    expect(service.get('key2')).toBeNull();
  });
});
