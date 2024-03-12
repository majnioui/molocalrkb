import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HealthAndVersionDetailComponent } from './health-and-version-detail.component';

describe('HealthAndVersion Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthAndVersionDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: HealthAndVersionDetailComponent,
              resolve: { healthAndVersion: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(HealthAndVersionDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load healthAndVersion on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', HealthAndVersionDetailComponent);

      // THEN
      expect(instance.healthAndVersion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
