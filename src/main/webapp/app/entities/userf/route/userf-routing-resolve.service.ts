import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserf, Userf } from '../userf.model';
import { UserfService } from '../service/userf.service';

@Injectable({ providedIn: 'root' })
export class UserfRoutingResolveService implements Resolve<IUserf> {
  constructor(protected service: UserfService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserf> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userf: HttpResponse<Userf>) => {
          if (userf.body) {
            return of(userf.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Userf());
  }
}
