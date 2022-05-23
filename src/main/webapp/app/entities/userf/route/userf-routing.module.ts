import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserfComponent } from '../list/userf.component';
import { UserfDetailComponent } from '../detail/userf-detail.component';
import { UserfUpdateComponent } from '../update/userf-update.component';
import { UserfRoutingResolveService } from './userf-routing-resolve.service';

const userfRoute: Routes = [
  {
    path: '',
    component: UserfComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserfDetailComponent,
    resolve: {
      userf: UserfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserfUpdateComponent,
    resolve: {
      userf: UserfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserfUpdateComponent,
    resolve: {
      userf: UserfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userfRoute)],
  exports: [RouterModule],
})
export class UserfRoutingModule {}
