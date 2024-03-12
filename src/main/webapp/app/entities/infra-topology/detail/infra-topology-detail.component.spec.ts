import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InfraTopologyDetailComponent } from './infra-topology-detail.component';

describe('InfraTopology Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfraTopologyDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: InfraTopologyDetailComponent,
              resolve: { infraTopology: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InfraTopologyDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load infraTopology on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InfraTopologyDetailComponent);

      // THEN
      expect(instance.infraTopology).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
