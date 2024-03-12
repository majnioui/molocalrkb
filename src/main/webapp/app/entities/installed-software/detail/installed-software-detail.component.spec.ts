import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InstalledSoftwareDetailComponent } from './installed-software-detail.component';

describe('InstalledSoftware Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstalledSoftwareDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InstalledSoftwareDetailComponent,
              resolve: { installedSoftware: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InstalledSoftwareDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load installedSoftware on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InstalledSoftwareDetailComponent);

      // THEN
      expect(instance.installedSoftware).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
