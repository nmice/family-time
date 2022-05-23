import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserfService } from '../service/userf.service';
import { IUserf, Userf } from '../userf.model';
import { IFamily } from 'app/entities/family/family.model';
import { FamilyService } from 'app/entities/family/service/family.service';

import { UserfUpdateComponent } from './userf-update.component';

describe('Userf Management Update Component', () => {
  let comp: UserfUpdateComponent;
  let fixture: ComponentFixture<UserfUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userfService: UserfService;
  let familyService: FamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserfUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UserfUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserfUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userfService = TestBed.inject(UserfService);
    familyService = TestBed.inject(FamilyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Family query and add missing value', () => {
      const userf: IUserf = { id: 456 };
      const family: IFamily = { id: 31983 };
      userf.family = family;

      const familyCollection: IFamily[] = [{ id: 83768 }];
      jest.spyOn(familyService, 'query').mockReturnValue(of(new HttpResponse({ body: familyCollection })));
      const additionalFamilies = [family];
      const expectedCollection: IFamily[] = [...additionalFamilies, ...familyCollection];
      jest.spyOn(familyService, 'addFamilyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userf });
      comp.ngOnInit();

      expect(familyService.query).toHaveBeenCalled();
      expect(familyService.addFamilyToCollectionIfMissing).toHaveBeenCalledWith(familyCollection, ...additionalFamilies);
      expect(comp.familiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userf: IUserf = { id: 456 };
      const family: IFamily = { id: 37805 };
      userf.family = family;

      activatedRoute.data = of({ userf });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(userf));
      expect(comp.familiesSharedCollection).toContain(family);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Userf>>();
      const userf = { id: 123 };
      jest.spyOn(userfService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userf });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userf }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(userfService.update).toHaveBeenCalledWith(userf);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Userf>>();
      const userf = new Userf();
      jest.spyOn(userfService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userf });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userf }));
      saveSubject.complete();

      // THEN
      expect(userfService.create).toHaveBeenCalledWith(userf);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Userf>>();
      const userf = { id: 123 };
      jest.spyOn(userfService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userf });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userfService.update).toHaveBeenCalledWith(userf);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFamilyById', () => {
      it('Should return tracked Family primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFamilyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
