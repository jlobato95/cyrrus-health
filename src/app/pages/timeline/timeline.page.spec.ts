import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TimelinePage } from './timeline.page';
import { VaccineService } from '../../services/vaccine.service';
import { AlertService } from '../../services/alert.service';

describe('TimelinePage', () => {
  let component: TimelinePage;
  let fixture: ComponentFixture<TimelinePage>;
  let vaccineService: VaccineService;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    localStorage.clear();
    const alertSpy = jasmine.createSpyObj('AlertService', ['showToast', 'showInfo', 'showConfirm']);

    await TestBed.configureTestingModule({
      imports: [TimelinePage],
      providers: [
        VaccineService,
        { provide: AlertService, useValue: alertSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelinePage);
    component = fixture.componentInstance;
    vaccineService = TestBed.inject(VaccineService);
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create and load active child', () => {
    // Assert
    expect(component).toBeTruthy();
    expect(component.activeChild().name).toBe('Leo Silva');
  });

  it('should group active child vaccines by milestone (Arrange-Act-Assert)', () => {
    // Arrange & Act
    const groups = component.groupedVaccines();

    // Assert
    expect(groups.length).toBeGreaterThan(0);
    // Primeiro milestone padrão deve ser "Ao Nascer"
    expect(groups[0].milestone).toBe('Ao Nascer');
    expect(groups[0].status).toBe('applied'); // BCG e Hep B aplicadas
  });

  it('should trigger PDF download mock feedback', () => {
    // Act
    component.downloadPdf();
    fixture.detectChanges();

    // Assert
    expect(alertServiceSpy.showToast).toHaveBeenCalledWith(
      `O download da Carteira Digital de Vacinação de Leo Silva foi iniciado no formato PDF.`,
      'success'
    );
  });

  it('should register vaccine as applied and trigger toast', () => {
    // Arrange
    const groups = component.groupedVaccines();
    const alertGroup = groups.find((g) => g.status === 'alert');
    expect(alertGroup).toBeDefined();
    const targetVaccine = alertGroup!.items[0];

    // Act
    component.applyVaccine(targetVaccine.id);
    fixture.detectChanges();

    // Assert
    expect(alertServiceSpy.showToast).toHaveBeenCalledWith(
      'Vacina registrada como aplicada com sucesso!',
      'success'
    );
  });
});
