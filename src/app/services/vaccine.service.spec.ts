import { TestBed } from '@angular/core/testing';
import { VaccineService } from './vaccine.service';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../config/storage-keys.config';

describe('VaccineService', () => {
  let service: VaccineService;
  let storageService: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [VaccineService, StorageService],
    });
    service = TestBed.inject(VaccineService);
    storageService = TestBed.inject(StorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load default children on init if storage is empty', () => {
    // Arrange & Act
    const children = service.children();

    // Assert
    expect(children.length).toBe(2);
    expect(children[0].name).toBe('Leo Silva');
    expect(children[1].name).toBe('Mia Silva');
  });

  it('should change active child and save to storage', () => {
    // Act
    service.selectChild('mia-silva');

    // Assert
    expect(service.activeChild().id).toBe('mia-silva');
    expect(storageService.get<string>(STORAGE_KEYS.ACTIVE_CHILD_ID)).toBe('mia-silva');
  });

  it('should add a new child and save to storage (Arrange-Act-Assert)', () => {
    // Act
    service.addChild('Arthur Silva', '3 Meses');

    // Assert
    const children = service.children();
    expect(children.length).toBe(3);
    expect(children[2].name).toBe('Arthur Silva');
    expect(children[2].id).toBe('arthur-silva');
    expect(service.activeChild().id).toBe('arthur-silva');
    
    // Verifica persistência no storage
    const storedChildren = storageService.get<any[]>(STORAGE_KEYS.CHILDREN);
    expect(storedChildren?.length).toBe(3);
    expect(storedChildren?.[2].id).toBe('arthur-silva');
  });

  it('should mark vaccine as applied, recompute metrics and save to storage', () => {
    // Arrange
    service.selectChild('leo-silva');
    const vaccinesBefore = service.activeChildVaccines();
    const targetVaccine = vaccinesBefore.find((v) => v.status === 'alert');
    expect(targetVaccine).toBeDefined();

    // Act
    service.markAsApplied(targetVaccine!.id);

    // Assert
    const vaccinesAfter = service.activeChildVaccines();
    const updatedVaccine = vaccinesAfter.find((v) => v.id === targetVaccine!.id);
    expect(updatedVaccine?.status).toBe('applied');
    expect(updatedVaccine?.dateText).toContain('Aplicada em');

    // Verifica que as métricas foram atualizadas (Leo Silva tinha 2 atrasadas, agora tem 1)
    const metrics = service.activeChildMetrics();
    expect(metrics.alert).toBe(1);
    
    // Verifica persistência no storage
    const storedVaccines = storageService.get<Record<string, any[]>>(STORAGE_KEYS.VACCINES);
    const leoVaccines = storedVaccines?.['leo-silva'];
    const storedAppliedVaccine = leoVaccines?.find((v) => v.id === targetVaccine!.id);
    expect(storedAppliedVaccine?.status).toBe('applied');
  });
});
