import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../websites.test-samples';

import { WebsitesFormService } from './websites-form.service';

describe('Websites Form Service', () => {
  let service: WebsitesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsitesFormService);
  });

  describe('Service methods', () => {
    describe('createWebsitesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWebsitesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            website: expect.any(Object),
            websiteId: expect.any(Object),
            cls: expect.any(Object),
            pageViews: expect.any(Object),
            pageLoads: expect.any(Object),
            onLoadTime: expect.any(Object),
            date: expect.any(Object),
          }),
        );
      });

      it('passing IWebsites should create a new form with FormGroup', () => {
        const formGroup = service.createWebsitesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            website: expect.any(Object),
            websiteId: expect.any(Object),
            cls: expect.any(Object),
            pageViews: expect.any(Object),
            pageLoads: expect.any(Object),
            onLoadTime: expect.any(Object),
            date: expect.any(Object),
          }),
        );
      });
    });

    describe('getWebsites', () => {
      it('should return NewWebsites for default Websites initial value', () => {
        const formGroup = service.createWebsitesFormGroup(sampleWithNewData);

        const websites = service.getWebsites(formGroup) as any;

        expect(websites).toMatchObject(sampleWithNewData);
      });

      it('should return NewWebsites for empty Websites initial value', () => {
        const formGroup = service.createWebsitesFormGroup();

        const websites = service.getWebsites(formGroup) as any;

        expect(websites).toMatchObject({});
      });

      it('should return IWebsites', () => {
        const formGroup = service.createWebsitesFormGroup(sampleWithRequiredData);

        const websites = service.getWebsites(formGroup) as any;

        expect(websites).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWebsites should not enable id FormControl', () => {
        const formGroup = service.createWebsitesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWebsites should disable id FormControl', () => {
        const formGroup = service.createWebsitesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
