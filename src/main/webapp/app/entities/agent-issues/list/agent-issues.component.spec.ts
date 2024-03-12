import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AgentIssuesService } from '../service/agent-issues.service';

import { AgentIssuesComponent } from './agent-issues.component';

describe('AgentIssues Management Component', () => {
  let comp: AgentIssuesComponent;
  let fixture: ComponentFixture<AgentIssuesComponent>;
  let service: AgentIssuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'agent-issues', component: AgentIssuesComponent }]),
        HttpClientTestingModule,
        AgentIssuesComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(AgentIssuesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgentIssuesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AgentIssuesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.agentIssues?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to agentIssuesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAgentIssuesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAgentIssuesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
