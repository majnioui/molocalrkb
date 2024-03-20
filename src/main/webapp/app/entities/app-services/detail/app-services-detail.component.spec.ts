import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AppServicesDetailComponent } from './app-services-detail.component';

describe('AppServices Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppServicesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AppServicesDetailComponent,
              resolve: { appServices: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AppServicesDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load appServices on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AppServicesDetailComponent);

      // THEN
      expect(instance.appServices).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
