import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CampaignsPage } from './campaigns.page';
import { VaccineService } from '../../services/vaccine.service';
import { AlertService } from '../../services/alert.service';

describe('CampaignsPage', () => {
  let component: CampaignsPage;
  let fixture: ComponentFixture<CampaignsPage>;
  let vaccineService: VaccineService;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    localStorage.clear();
    const alertSpy = jasmine.createSpyObj('AlertService', ['showToast', 'showInfo', 'showConfirm']);

    await TestBed.configureTestingModule({
      imports: [CampaignsPage],
      providers: [
        provideRouter([]),
        VaccineService,
        { provide: AlertService, useValue: alertSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignsPage);
    component = fixture.componentInstance;
    vaccineService = TestBed.inject(VaccineService);
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create and load campaigns', () => {
    // Assert
    expect(component).toBeTruthy();
    expect(component.campaigns().length).toBe(4);
  });

  it('should identify featured campaign (gripe)', () => {
    // Arrange & Act
    const featured = component.featuredCampaign();

    // Assert
    expect(featured).toBeTruthy();
    expect(featured?.id).toBe('campanha-gripe');
  });

  it('should calculate eligibility alerts for families dynamic children (Arrange-Act-Assert)', () => {
    // Arrange & Act
    const alerts = component.eligibilityAlerts();

    // Assert
    // Leo Silva (14 Meses): acima de 6 meses (Influenza) e entre 1 e 5 anos (Pólio) -> 2 alertas
    // Mia Silva (8 Meses): acima de 6 meses (Influenza) -> 1 alerta
    // Total de alertas esperados: 3
    expect(alerts.length).toBe(3);
    
    const leoGripe = alerts.find((a) => a.id === 'leo-silva-gripe');
    const leoPolio = alerts.find((a) => a.id === 'leo-silva-polio');
    const miaGripe = alerts.find((a) => a.id === 'mia-silva-gripe');

    expect(leoGripe).toBeDefined();
    expect(leoPolio).toBeDefined();
    expect(miaGripe).toBeDefined();
  });

  it('should trigger find clinics info modal', () => {
    // Act
    component.findClinics();
    fixture.detectChanges();

    // Assert
    expect(alertServiceSpy.showInfo).toHaveBeenCalledWith(
      'Buscar Clínicas',
      'Buscando as clínicas de saúde e postos de vacinação mais próximos da sua localização...'
    );
  });

  it('should change active child in VaccineService when selecting profile link', () => {
    // Act
    component.selectChild('mia-silva');
    fixture.detectChanges();

    // Assert
    expect(vaccineService.activeChild().id).toBe('mia-silva');
  });
});
