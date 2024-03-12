import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EventsDetailComponent } from './events-detail.component';

describe('Events Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EventsDetailComponent,
              resolve: { events: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EventsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load events on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EventsDetailComponent);

      // THEN
      expect(instance.events).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
