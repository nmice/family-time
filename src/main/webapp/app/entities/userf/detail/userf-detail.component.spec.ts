import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserfDetailComponent } from './userf-detail.component';

describe('Userf Management Detail Component', () => {
  let comp: UserfDetailComponent;
  let fixture: ComponentFixture<UserfDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserfDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userf: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserfDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserfDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userf on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userf).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
