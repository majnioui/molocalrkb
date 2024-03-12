import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventsService } from '../service/events.service';
import { IEvents } from '../events.model';
import { EventsFormService } from './events-form.service';

import { EventsUpdateComponent } from './events-update.component';

describe('Events Management Update Component', () => {
  let comp: EventsUpdateComponent;
  let fixture: ComponentFixture<EventsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventsFormService: EventsFormService;
  let eventsService: EventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EventsUpdateComponent],
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
      .overrideTemplate(EventsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventsFormService = TestBed.inject(EventsFormService);
    eventsService = TestBed.inject(EventsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const events: IEvents = { id: 456 };

      activatedRoute.data = of({ events });
      comp.ngOnInit();

      expect(comp.events).toEqual(events);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvents>>();
      const events = { id: 123 };
      jest.spyOn(eventsFormService, 'getEvents').mockReturnValue(events);
      jest.spyOn(eventsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ events });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: events }));
      saveSubject.complete();

      // THEN
      expect(eventsFormService.getEvents).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventsService.update).toHaveBeenCalledWith(expect.objectContaining(events));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvents>>();
      const events = { id: 123 };
      jest.spyOn(eventsFormService, 'getEvents').mockReturnValue({ id: null });
      jest.spyOn(eventsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ events: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: events }));
      saveSubject.complete();

      // THEN
      expect(eventsFormService.getEvents).toHaveBeenCalled();
      expect(eventsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvents>>();
      const events = { id: 123 };
      jest.spyOn(eventsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ events });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
