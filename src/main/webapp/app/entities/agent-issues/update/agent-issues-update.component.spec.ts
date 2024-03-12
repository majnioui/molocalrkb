import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AgentIssuesService } from '../service/agent-issues.service';
import { IAgentIssues } from '../agent-issues.model';
import { AgentIssuesFormService } from './agent-issues-form.service';

import { AgentIssuesUpdateComponent } from './agent-issues-update.component';

describe('AgentIssues Management Update Component', () => {
  let comp: AgentIssuesUpdateComponent;
  let fixture: ComponentFixture<AgentIssuesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let agentIssuesFormService: AgentIssuesFormService;
  let agentIssuesService: AgentIssuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AgentIssuesUpdateComponent],
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
      .overrideTemplate(AgentIssuesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgentIssuesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    agentIssuesFormService = TestBed.inject(AgentIssuesFormService);
    agentIssuesService = TestBed.inject(AgentIssuesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const agentIssues: IAgentIssues = { id: 456 };

      activatedRoute.data = of({ agentIssues });
      comp.ngOnInit();

      expect(comp.agentIssues).toEqual(agentIssues);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentIssues>>();
      const agentIssues = { id: 123 };
      jest.spyOn(agentIssuesFormService, 'getAgentIssues').mockReturnValue(agentIssues);
      jest.spyOn(agentIssuesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentIssues });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agentIssues }));
      saveSubject.complete();

      // THEN
      expect(agentIssuesFormService.getAgentIssues).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(agentIssuesService.update).toHaveBeenCalledWith(expect.objectContaining(agentIssues));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentIssues>>();
      const agentIssues = { id: 123 };
      jest.spyOn(agentIssuesFormService, 'getAgentIssues').mockReturnValue({ id: null });
      jest.spyOn(agentIssuesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentIssues: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agentIssues }));
      saveSubject.complete();

      // THEN
      expect(agentIssuesFormService.getAgentIssues).toHaveBeenCalled();
      expect(agentIssuesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentIssues>>();
      const agentIssues = { id: 123 };
      jest.spyOn(agentIssuesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentIssues });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(agentIssuesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
