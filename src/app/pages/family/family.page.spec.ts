import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FamilyPage } from './family.page';
import { VaccineService } from '../../services/vaccine.service';
import { AlertService } from '../../services/alert.service';

describe('FamilyPage', () => {
  let component: FamilyPage;
  let fixture: ComponentFixture<FamilyPage>;
  let vaccineService: VaccineService;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    localStorage.clear();
    const alertSpy = jasmine.createSpyObj('AlertService', ['showToast', 'showInfo', 'showConfirm']);

    await TestBed.configureTestingModule({
      imports: [FamilyPage],
      providers: [
        provideRouter([]),
        VaccineService,
        { provide: AlertService, useValue: alertSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyPage);
    component = fixture.componentInstance;
    vaccineService = TestBed.inject(VaccineService);
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create and load children list', () => {
    // Assert
    expect(component).toBeTruthy();
    expect(component.children().length).toBe(2);
  });

  it('should select child profile', () => {
    // Act
    component.selectChild('mia-silva');
    fixture.detectChanges();

    // Assert
    expect(component.activeChild().id).toBe('mia-silva');
  });

  it('should open and close add child modal', () => {
    // Act (Open)
    component.openAddModal();
    fixture.detectChanges();

    // Assert (Open)
    expect(component.isAddingChild()).toBeTrue();
    expect(component.newChildName).toBe('');
    expect(component.newChildAge).toBe('');

    // Act (Close)
    component.closeAddModal();
    fixture.detectChanges();

    // Assert (Close)
    expect(component.isAddingChild()).toBeFalse();
  });

  it('should trigger warning toast when saving child with empty fields', () => {
    // Arrange
    component.openAddModal();
    component.newChildName = '';
    component.newChildAge = '';

    // Act
    component.saveChild();
    fixture.detectChanges();

    // Assert
    expect(alertServiceSpy.showToast).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos obrigatórios.',
      'warning'
    );
  });

  it('should successfully add a new child, save profile and trigger success toast (Arrange-Act-Assert)', () => {
    // Arrange
    component.openAddModal();
    component.newChildName = 'Diana Silva';
    component.newChildAge = '6 Meses';

    // Act
    component.saveChild();
    fixture.detectChanges();

    // Assert
    expect(vaccineService.children().length).toBe(3);
    expect(vaccineService.children()[2].name).toBe('Diana Silva');
    expect(alertServiceSpy.showToast).toHaveBeenCalledWith(
      'Perfil de dependente cadastrado com sucesso!',
      'success'
    );
    expect(component.isAddingChild()).toBeFalse();
  });
});
