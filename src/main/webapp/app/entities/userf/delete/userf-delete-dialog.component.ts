import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserf } from '../userf.model';
import { UserfService } from '../service/userf.service';

@Component({
  templateUrl: './userf-delete-dialog.component.html',
})
export class UserfDeleteDialogComponent {
  userf?: IUserf;

  constructor(protected userfService: UserfService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userfService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
