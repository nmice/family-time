import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserf, getUserfIdentifier } from '../userf.model';

export type EntityResponseType = HttpResponse<IUserf>;
export type EntityArrayResponseType = HttpResponse<IUserf[]>;

@Injectable({ providedIn: 'root' })
export class UserfService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/userfs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userf: IUserf): Observable<EntityResponseType> {
    return this.http.post<IUserf>(this.resourceUrl, userf, { observe: 'response' });
  }

  update(userf: IUserf): Observable<EntityResponseType> {
    return this.http.put<IUserf>(`${this.resourceUrl}/${getUserfIdentifier(userf) as number}`, userf, { observe: 'response' });
  }

  partialUpdate(userf: IUserf): Observable<EntityResponseType> {
    return this.http.patch<IUserf>(`${this.resourceUrl}/${getUserfIdentifier(userf) as number}`, userf, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserf>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserf[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserfToCollectionIfMissing(userfCollection: IUserf[], ...userfsToCheck: (IUserf | null | undefined)[]): IUserf[] {
    const userfs: IUserf[] = userfsToCheck.filter(isPresent);
    if (userfs.length > 0) {
      const userfCollectionIdentifiers = userfCollection.map(userfItem => getUserfIdentifier(userfItem)!);
      const userfsToAdd = userfs.filter(userfItem => {
        const userfIdentifier = getUserfIdentifier(userfItem);
        if (userfIdentifier == null || userfCollectionIdentifiers.includes(userfIdentifier)) {
          return false;
        }
        userfCollectionIdentifiers.push(userfIdentifier);
        return true;
      });
      return [...userfsToAdd, ...userfCollection];
    }
    return userfCollection;
  }
}
