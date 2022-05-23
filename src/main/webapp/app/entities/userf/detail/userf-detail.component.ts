import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserf } from '../userf.model';

@Component({
  selector: 'jhi-userf-detail',
  templateUrl: './userf-detail.component.html',
})
export class UserfDetailComponent implements OnInit {
  userf: IUserf | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userf }) => {
      this.userf = userf;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
