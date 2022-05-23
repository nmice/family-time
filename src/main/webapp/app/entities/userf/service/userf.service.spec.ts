import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserf, Userf } from '../userf.model';

import { UserfService } from './userf.service';

describe('Userf Service', () => {
  let service: UserfService;
  let httpMock: HttpTestingController;
  let elemDefault: IUserf;
  let expectedResult: IUserf | IUserf[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserfService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      login: 'AAAAAAA',
      pass: 'AAAAAAA',
      name: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Userf', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Userf()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Userf', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          login: 'BBBBBB',
          pass: 'BBBBBB',
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Userf', () => {
      const patchObject = Object.assign(
        {
          login: 'BBBBBB',
          name: 'BBBBBB',
        },
        new Userf()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Userf', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          login: 'BBBBBB',
          pass: 'BBBBBB',
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Userf', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUserfToCollectionIfMissing', () => {
      it('should add a Userf to an empty array', () => {
        const userf: IUserf = { id: 123 };
        expectedResult = service.addUserfToCollectionIfMissing([], userf);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userf);
      });

      it('should not add a Userf to an array that contains it', () => {
        const userf: IUserf = { id: 123 };
        const userfCollection: IUserf[] = [
          {
            ...userf,
          },
          { id: 456 },
        ];
        expectedResult = service.addUserfToCollectionIfMissing(userfCollection, userf);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Userf to an array that doesn't contain it", () => {
        const userf: IUserf = { id: 123 };
        const userfCollection: IUserf[] = [{ id: 456 }];
        expectedResult = service.addUserfToCollectionIfMissing(userfCollection, userf);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userf);
      });

      it('should add only unique Userf to an array', () => {
        const userfArray: IUserf[] = [{ id: 123 }, { id: 456 }, { id: 8343 }];
        const userfCollection: IUserf[] = [{ id: 123 }];
        expectedResult = service.addUserfToCollectionIfMissing(userfCollection, ...userfArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userf: IUserf = { id: 123 };
        const userf2: IUserf = { id: 456 };
        expectedResult = service.addUserfToCollectionIfMissing([], userf, userf2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userf);
        expect(expectedResult).toContain(userf2);
      });

      it('should accept null and undefined values', () => {
        const userf: IUserf = { id: 123 };
        expectedResult = service.addUserfToCollectionIfMissing([], null, userf, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userf);
      });

      it('should return initial array if no Userf is added', () => {
        const userfCollection: IUserf[] = [{ id: 123 }];
        expectedResult = service.addUserfToCollectionIfMissing(userfCollection, undefined, null);
        expect(expectedResult).toEqual(userfCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
