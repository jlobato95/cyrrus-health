import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPage } from './dashboard.page';
import { VaccineService } from '../../services/vaccine.service';
import { AlertService } from '../../services/alert.service';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let vaccineService: VaccineService;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    localStorage.clear();
    const alertSpy = jasmine.createSpyObj('AlertService', ['showToast', 'showInfo', 'showConfirm']);

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        VaccineService,
        { provide: AlertService, useValue: alertSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    vaccineService = TestBed.inject(VaccineService);
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create and load active child details', () => {
    // Assert
    expect(component).toBeTruthy();
    expect(component.activeChild().name).toBe('Leo Silva');
  });

  it('should compute metrics for the active child (Arrange-Act-Assert)', () => {
    // Arrange & Act
    const metrics = component.metrics();

    // Assert
    expect(metrics.applied).toBe(2);
    expect(metrics.alert).toBe(2);
    expect(metrics.pending).toBe(2);
  });

  it('should identify spotlight vaccine (first overdue or pending)', () => {
    // Arrange & Act
    const spotlight = component.spotlightVaccine();

    // Assert
    expect(spotlight).toBeTruthy();
    expect(spotlight?.status).toBe('alert');
    expect(spotlight?.name).toBe('Tríplice Viral');
  });

  it('should apply vaccine and trigger toast feedback', () => {
    // Arrange
    const initialSpotlight = component.spotlightVaccine();
    expect(initialSpotlight).toBeTruthy();

    // Act
    component.applyVaccine(initialSpotlight!.id);
    fixture.detectChanges();

    // Assert
    expect(alertServiceSpy.showToast).toHaveBeenCalledWith(
      'Vacina registrada como aplicada com sucesso!',
      'success'
    );
  });
});
