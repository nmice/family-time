import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserfComponent } from './list/userf.component';
import { UserfDetailComponent } from './detail/userf-detail.component';
import { UserfUpdateComponent } from './update/userf-update.component';
import { UserfDeleteDialogComponent } from './delete/userf-delete-dialog.component';
import { UserfRoutingModule } from './route/userf-routing.module';

@NgModule({
  imports: [SharedModule, UserfRoutingModule],
  declarations: [UserfComponent, UserfDetailComponent, UserfUpdateComponent, UserfDeleteDialogComponent],
  entryComponents: [UserfDeleteDialogComponent],
})
export class UserfModule {}
