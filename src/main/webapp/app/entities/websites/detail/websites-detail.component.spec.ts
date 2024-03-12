import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WebsitesDetailComponent } from './websites-detail.component';

describe('Websites Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsitesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: WebsitesDetailComponent,
              resolve: { websites: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(WebsitesDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load websites on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', WebsitesDetailComponent);

      // THEN
      expect(instance.websites).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
