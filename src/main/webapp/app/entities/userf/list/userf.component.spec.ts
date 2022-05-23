import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserfService } from '../service/userf.service';

import { UserfComponent } from './userf.component';

describe('Userf Management Component', () => {
  let comp: UserfComponent;
  let fixture: ComponentFixture<UserfComponent>;
  let service: UserfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserfComponent],
    })
      .overrideTemplate(UserfComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserfComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserfService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.userfs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
