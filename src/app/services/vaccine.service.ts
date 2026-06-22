import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../config/storage-keys.config';

export interface Child {
  id: string;
  name: string;
  age: string;
  avatarUrl: string;
  statusText: string;
  statusType: 'applied' | 'pending' | 'alert';
}

export interface Vaccine {
  id: string;
  name: string;
  dose: string;
  milestone: string;
  status: 'applied' | 'pending' | 'alert';
  dateText: string;
  dateIcon: string;
  delayDays?: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  dateRange: string;
  targetAge: string;
  status: 'active' | 'upcoming';
  icon: string;
  bgColor: string;
  textColor: string;
}

// Funções auxiliares para cálculo dinâmico de datas com base no dia de hoje
function formatarDataMock(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function adicionarMeses(data: Date, meses: number): Date {
  const d = new Date(data.getTime());
  d.setMonth(d.getMonth() + meses);
  return d;
}

function calcularDiferencaDias(dataInicio: Date, dataFim: Date): number {
  const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const HOJE = new Date();

// Leo Silva (14 Meses de idade hoje)
const dataNascLeo = new Date(HOJE.getFullYear(), HOJE.getMonth() - 14, HOJE.getDate());
const leoVacina12m = adicionarMeses(dataNascLeo, 12);
const delayDaysLeo = calcularDiferencaDias(leoVacina12m, HOJE);

// Mia Silva (8 Meses de idade hoje)
const dataNascMia = new Date(HOJE.getFullYear(), HOJE.getMonth() - 8, HOJE.getDate());

// Dados iniciais padrão (fallbacks do localStorage)
const DEFAULT_CHILDREN: Child[] = [
  {
    id: 'leo-silva',
    name: 'Leo Silva',
    age: '14 Meses',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxyVtBjCc25hwysfkBoSDbrvkSnpF6tW50SvZutEBhSdvYAdXe44lHSfpIjHaXnliTzKJL16HA7iNnwPR0cZ2_oXgncR_LdEztqsohlCPcg-OiDewIJVPSNbsJSZaHe84Y-TpZWni0fzbVthkpqKIbQ8DzpZ4WhQ9Jr9howEYA1eI0SqtmiwcSb3fKMS8FRsGD4EoQltD57WnZn0A7RaoCCcW1LmkOYyau1H3Uyp7_6eYouZHzvYRsAhJY2ExVTM_ZzWIwrqQeJPOn',
    statusText: 'Possui vacinas atrasadas',
    statusType: 'alert',
  },
  {
    id: 'mia-silva',
    name: 'Mia Silva',
    age: '8 Meses',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlbtLNnAWY3m2NwWyhr7ipLB68x_oTxp2lpz_rekycuvWvJGJvIgi070pAeWBszFhPfcnkMWVH5U2LVYUIkYq7AAu90PdmoJnpyVZ96eXKyRJzqaR0H6mGMsC9jCNMf5wWNmP9MMfUXHrAx1VovaNkHaO6orDP94jF2BhmxhT60_SRChsIE82YG6ZWgP_57VKsZxsLoXCdCqv0NTNQ5z2RBNC2o09mKHCFNkEKseXkbD_xWKAfBqhVFTxgy8LlrFe3eZZ-p1er10cw',
    statusText: '1 vacina agendada em breve',
    statusType: 'pending',
  },
];

const DEFAULT_ACTIVE_CHILD_ID = 'leo-silva';

const DEFAULT_VACCINES: Record<string, Vaccine[]> = {
  'leo-silva': [
    {
      id: 'bcg',
      name: 'BCG',
      dose: 'Dose Única',
      milestone: 'Ao Nascer',
      status: 'applied',
      dateText: `Aplicada em ${formatarDataMock(dataNascLeo)}`,
      dateIcon: 'calendar_today',
    },
    {
      id: 'hepb-1',
      name: 'Hepatite B',
      dose: '1ª Dose',
      milestone: 'Ao Nascer',
      status: 'applied',
      dateText: `Aplicada em ${formatarDataMock(dataNascLeo)}`,
      dateIcon: 'calendar_today',
    },
    {
      id: 'scr-1',
      name: 'Tríplice Viral',
      dose: '1ª Dose (SCR)',
      milestone: '12 Meses',
      status: 'alert',
      dateText: `Venceu em: ${formatarDataMock(leoVacina12m)}`,
      dateIcon: 'event_busy',
      delayDays: delayDaysLeo,
    },
    {
      id: 'hepa-2',
      name: 'Hepatite A',
      dose: '2ª Dose',
      milestone: '12 Meses',
      status: 'alert',
      dateText: `Venceu em: ${formatarDataMock(leoVacina12m)}`,
      dateIcon: 'event_busy',
      delayDays: delayDaysLeo,
    },
    {
      id: 'dtp-ref',
      name: 'DTP',
      dose: '1º Reforço',
      milestone: '15 Meses',
      status: 'pending',
      dateText: `Agendado para ${formatarDataMock(adicionarMeses(dataNascLeo, 15))}`,
      dateIcon: 'calendar_month',
    },
    {
      id: 'vop-ref',
      name: 'VOP',
      dose: '1º Reforço',
      milestone: '15 Meses',
      status: 'pending',
      dateText: `Agendado para ${formatarDataMock(adicionarMeses(dataNascLeo, 15))}`,
      dateIcon: 'calendar_month',
    },
  ],
  'mia-silva': [
    {
      id: 'bcg-mia',
      name: 'BCG',
      dose: 'Dose Única',
      milestone: 'Ao Nascer',
      status: 'applied',
      dateText: `Aplicada em ${formatarDataMock(dataNascMia)}`,
      dateIcon: 'calendar_today',
    },
    {
      id: 'hepb-mia-1',
      name: 'Hepatite B',
      dose: '1ª Dose',
      milestone: 'Ao Nascer',
      status: 'applied',
      dateText: `Aplicada em ${formatarDataMock(dataNascMia)}`,
      dateIcon: 'calendar_today',
    },
    {
      id: 'penta-mia-1',
      name: 'Pentavalente',
      dose: '1ª Dose',
      milestone: '2 Meses',
      status: 'applied',
      dateText: `Aplicada em ${formatarDataMock(adicionarMeses(dataNascMia, 2))}`,
      dateIcon: 'calendar_today',
    },
    {
      id: 'vip-mia-1',
      name: 'Poliomielite (VIP)',
      dose: '1ª Dose',
      milestone: '2 Meses',
      status: 'applied',
      dateText: `Aplicada em ${formatarDataMock(adicionarMeses(dataNascMia, 2))}`,
      dateIcon: 'calendar_today',
    },
    {
      id: 'penta-mia-2',
      name: 'Pentavalente',
      dose: '2ª Dose',
      milestone: '4 Meses',
      status: 'applied',
      dateText: `Aplicada em ${formatarDataMock(adicionarMeses(dataNascMia, 4))}`,
      dateIcon: 'calendar_today',
    },
    {
      id: 'vip-mia-2',
      name: 'Poliomielite (VIP)',
      dose: '2ª Dose',
      milestone: '4 Meses',
      status: 'applied',
      dateText: `Aplicada em ${formatarDataMock(adicionarMeses(dataNascMia, 4))}`,
      dateIcon: 'calendar_today',
    },
    {
      id: 'penta-mia-3',
      name: 'Pentavalente',
      dose: '3ª Dose',
      milestone: '6 Meses',
      status: 'pending',
      dateText: `Agendado para ${formatarDataMock(adicionarMeses(dataNascMia, 9))}`,
      dateIcon: 'calendar_month',
    },
  ],
};

const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: 'campanha-gripe',
    title: 'A Temporada de Gripe 2026 Chegou',
    description: 'Proteja sua família contra as cepas mais recentes. A vacina anual contra a gripe é recomendada para todas as crianças a partir de 6 meses.',
    dateRange: '15 Abr - 30 Jun',
    targetAge: '6+ meses',
    status: 'active',
    icon: 'vaccines',
    bgColor: 'bg-primary-container',
    textColor: 'text-on-primary-container',
  },
  {
    id: 'campanha-covid',
    title: 'Reforço Pediátrico COVID-19',
    description: 'Reforços atualizados visando variantes recentes já disponíveis para crianças.',
    dateRange: 'Em andamento',
    targetAge: '6 meses - 11 anos',
    status: 'active',
    icon: 'coronavirus',
    bgColor: 'bg-secondary-fixed',
    textColor: 'text-secondary',
  },
  {
    id: 'campanha-polio',
    title: 'Dia Nacional da Pólio',
    description: 'Um esforço nacional de um único dia para garantir que todas as crianças estejam protegidas contra a Pólio.',
    dateRange: '24 de Outubro, 2026',
    targetAge: '1 - 5 anos',
    status: 'upcoming',
    icon: 'child_care',
    bgColor: 'bg-tertiary-fixed',
    textColor: 'text-tertiary',
  },
  {
    id: 'campanha-escola',
    title: 'Campanha de Volta às Aulas',
    description: 'Garanta que seu filho tenha todas as vacinas obrigatórias antes do início do novo ano letivo.',
    dateRange: '15 Jan - 01 Mar',
    targetAge: '4 - 6 anos',
    status: 'active',
    icon: 'health_and_safety',
    bgColor: 'bg-primary-fixed',
    textColor: 'text-primary',
  },
];


const DATA_VERSION = 'v2_dinamica';

@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  private readonly storageService = inject(StorageService);

  // Armazena a lista de crianças
  private readonly childrenList = signal<Child[]>(
    this.storageService.get<Child[]>(STORAGE_KEYS.CHILDREN) ?? DEFAULT_CHILDREN
  );

  // Armazena o ID da criança ativa selecionada
  private readonly activeChildId = signal<string>(
    this.storageService.get<string>(STORAGE_KEYS.ACTIVE_CHILD_ID) ?? DEFAULT_ACTIVE_CHILD_ID
  );

  // Armazena as vacinas de cada criança
  private readonly vaccinesMap = signal<Record<string, Vaccine[]>>(
    this.storageService.get<Record<string, Vaccine[]>>(STORAGE_KEYS.VACCINES) ?? DEFAULT_VACCINES
  );

  // Lista de campanhas de vacinação
  private readonly campaignsList = signal<Campaign[]>(DEFAULT_CAMPAIGNS);

  // Signals para leitura externa
  public readonly children = this.childrenList.asReadonly();
  public readonly campaigns = this.campaignsList.asReadonly();

  // Retorna os dados da criança selecionada
  public readonly activeChild = computed(() => {
    return this.children().find((c) => c.id === this.activeChildId()) ?? this.children()[0];
  });

  // Retorna as vacinas da criança selecionada
  public readonly activeChildVaccines = computed(() => {
    return this.vaccinesMap()[this.activeChildId()] ?? [];
  });

  // Calcula o total de vacinas por status (aplicadas, pendentes, atrasadas)
  public readonly activeChildMetrics = computed(() => {
    const vaccines = this.activeChildVaccines();
    const applied = vaccines.filter((v) => v.status === 'applied').length;
    const pending = vaccines.filter((v) => v.status === 'pending').length;
    const alert = vaccines.filter((v) => v.status === 'alert').length;

    return { applied, pending, alert };
  });

  constructor() {
    const currentVersion = this.storageService.get<string>('cyrrus_data_version');
    const storedChildren = this.storageService.get<Child[]>(STORAGE_KEYS.CHILDREN);
    const storedVaccines = this.storageService.get<Record<string, Vaccine[]>>(STORAGE_KEYS.VACCINES);

    // Inicializa ou reseta os dados caso a versão mude ou esteja vazio
    if (!storedChildren || !storedVaccines || currentVersion !== DATA_VERSION) {
      this.storageService.set(STORAGE_KEYS.CHILDREN, DEFAULT_CHILDREN);
      this.storageService.set(STORAGE_KEYS.ACTIVE_CHILD_ID, DEFAULT_ACTIVE_CHILD_ID);
      this.storageService.set(STORAGE_KEYS.VACCINES, DEFAULT_VACCINES);
      this.storageService.set('cyrrus_data_version', DATA_VERSION);
      
      this.childrenList.set(DEFAULT_CHILDREN);
      this.activeChildId.set(DEFAULT_ACTIVE_CHILD_ID);
      this.vaccinesMap.set(DEFAULT_VACCINES);
    }
  }

  // Alterar criança ativa
  public selectChild(id: string): void {
    if (this.vaccinesMap()[id]) {
      this.activeChildId.set(id);
      this.storageService.set(STORAGE_KEYS.ACTIVE_CHILD_ID, id);
    }
  }

  // Adicionar nova criança
  public addChild(name: string, age: string): void {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newChild: Child = {
      id,
      name,
      age,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAhV-ByGkAdbMm9xfuNhG4P9zeH1A3FkSkO0X2N8BspBBiO2i4f53tNU8WlcbL7rBQaDcAF4ad0h1Qioc_i1IgyBtRD2LR3soZMMOcrBIkZMKGnxiGPmpMIO3uJlzUBJ5m4Vb0HHsO9xyEvP3XvVHZzOkE7B5XesRcCQW1nF5PJajBMsiIDiCp1KoxV4VJwPSbMttZUVimSjAHueBKJHBVfPlo6lK2TnTGtV1bG0BNUz-eUH9Ry8JMzJanol4mc1cqZlGk1hbX47CE', // Avatar default
      statusText: 'Sem vacinas aplicadas',
      statusType: 'pending',
    };

    // Inicializa a lista de vacinas vazia ou com vacinas padrão ao nascer
    const newVaccinesList: Vaccine[] = [
      {
        id: `${id}-bcg`,
        name: 'BCG',
        dose: 'Dose Única',
        milestone: 'Ao Nascer',
        status: 'pending',
        dateText: 'Pendente',
        dateIcon: 'calendar_month',
      },
      {
        id: `${id}-hepb-1`,
        name: 'Hepatite B',
        dose: '1ª Dose',
        milestone: 'Ao Nascer',
        status: 'pending',
        dateText: 'Pendente',
        dateIcon: 'calendar_month',
      },
    ];

    this.vaccinesMap.update((prev) => {
      const updated = {
        ...prev,
        [id]: newVaccinesList,
      };
      this.storageService.set(STORAGE_KEYS.VACCINES, updated);
      return updated;
    });

    this.childrenList.update((prev) => {
      const updated = [...prev, newChild];
      this.storageService.set(STORAGE_KEYS.CHILDREN, updated);
      return updated;
    });

    this.activeChildId.set(id);
    this.storageService.set(STORAGE_KEYS.ACTIVE_CHILD_ID, id);
  }

  // Marcar vacina como aplicada
  public markAsApplied(vaccineId: string): void {
    const childId = this.activeChildId();
    this.vaccinesMap.update((prev) => {
      const list = prev[childId] ?? [];
      const updatedList = list.map((v) => {
        if (v.id === vaccineId) {
          const today = new Date().toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          return {
            ...v,
            status: 'applied' as const,
            dateText: `Aplicada em ${today}`,
            dateIcon: 'calendar_today',
            delayDays: undefined,
          };
        }
        return v;
      });

      // Atualiza o statusText da criança na lista global
      const alertCount = updatedList.filter((v) => v.status === 'alert').length;
      const pendingCount = updatedList.filter((v) => v.status === 'pending').length;

      let statusText = 'Todas as vacinas em dia';
      let statusType: 'applied' | 'pending' | 'alert' = 'applied';

      if (alertCount > 0) {
        statusText = 'Possui vacinas atrasadas';
        statusType = 'alert';
      } else if (pendingCount > 0) {
        statusText = `${pendingCount} vacina(s) agendada(s) em breve`;
        statusType = 'pending';
      }

      this.childrenList.update((kids) => {
        const updatedKids = kids.map((k) => (k.id === childId ? { ...k, statusText, statusType } : k));
        this.storageService.set(STORAGE_KEYS.CHILDREN, updatedKids);
        return updatedKids;
      });

      const updatedMap = {
        ...prev,
        [childId]: updatedList,
      };
      this.storageService.set(STORAGE_KEYS.VACCINES, updatedMap);
      return updatedMap;
    });
  }
}
