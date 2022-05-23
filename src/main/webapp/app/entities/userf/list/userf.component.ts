import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserf } from '../userf.model';
import { UserfService } from '../service/userf.service';
import { UserfDeleteDialogComponent } from '../delete/userf-delete-dialog.component';

@Component({
  selector: 'jhi-userf',
  templateUrl: './userf.component.html',
})
export class UserfComponent implements OnInit {
  userfs?: IUserf[];
  isLoading = false;

  constructor(protected userfService: UserfService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userfService.query().subscribe({
      next: (res: HttpResponse<IUserf[]>) => {
        this.isLoading = false;
        this.userfs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IUserf): number {
    return item.id!;
  }

  delete(userf: IUserf): void {
    const modalRef = this.modalService.open(UserfDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userf = userf;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
