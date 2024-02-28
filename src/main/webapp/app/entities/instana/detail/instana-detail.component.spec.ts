import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InstanaDetailComponent } from './instana-detail.component';

describe('Instana Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstanaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InstanaDetailComponent,
              resolve: { instana: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InstanaDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load instana on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InstanaDetailComponent);

      // THEN
      expect(instance.instana).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
