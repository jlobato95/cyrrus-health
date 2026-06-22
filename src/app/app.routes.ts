import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'timeline',
    loadComponent: () => import('./pages/timeline/timeline.page').then((m) => m.TimelinePage),
  },
  {
    path: 'family',
    loadComponent: () => import('./pages/family/family.page').then((m) => m.FamilyPage),
  },
  {
    path: 'campaigns',
    loadComponent: () => import('./pages/campaigns/campaigns.page').then((m) => m.CampaignsPage),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

