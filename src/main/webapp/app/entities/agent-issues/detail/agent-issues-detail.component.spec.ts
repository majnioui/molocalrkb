import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AgentIssuesDetailComponent } from './agent-issues-detail.component';

describe('AgentIssues Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentIssuesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AgentIssuesDetailComponent,
              resolve: { agentIssues: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AgentIssuesDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load agentIssues on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AgentIssuesDetailComponent);

      // THEN
      expect(instance.agentIssues).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
