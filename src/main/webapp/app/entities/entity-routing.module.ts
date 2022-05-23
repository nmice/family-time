import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'calendar-event',
        data: { pageTitle: 'familyTimeApp.calendarEvent.home.title' },
        loadChildren: () => import('./calendar-event/calendar-event.module').then(m => m.CalendarEventModule),
      },
      {
        path: 'family',
        data: { pageTitle: 'familyTimeApp.family.home.title' },
        loadChildren: () => import('./family/family.module').then(m => m.FamilyModule),
      },
      {
        path: 'userf',
        data: { pageTitle: 'familyTimeApp.userf.home.title' },
        loadChildren: () => import('./userf/userf.module').then(m => m.UserfModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
