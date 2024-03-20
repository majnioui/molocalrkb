import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAppServices } from '../app-services.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../app-services.test-samples';

import { AppServicesService, RestAppServices } from './app-services.service';

const requireRestSample: RestAppServices = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('AppServices Service', () => {
  let service: AppServicesService;
  let httpMock: HttpTestingController;
  let expectedResult: IAppServices | IAppServices[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AppServicesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AppServices', () => {
      const appServices = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(appServices).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AppServices', () => {
      const appServices = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(appServices).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AppServices', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AppServices', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AppServices', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAppServicesToCollectionIfMissing', () => {
      it('should add a AppServices to an empty array', () => {
        const appServices: IAppServices = sampleWithRequiredData;
        expectedResult = service.addAppServicesToCollectionIfMissing([], appServices);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appServices);
      });

      it('should not add a AppServices to an array that contains it', () => {
        const appServices: IAppServices = sampleWithRequiredData;
        const appServicesCollection: IAppServices[] = [
          {
            ...appServices,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAppServicesToCollectionIfMissing(appServicesCollection, appServices);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AppServices to an array that doesn't contain it", () => {
        const appServices: IAppServices = sampleWithRequiredData;
        const appServicesCollection: IAppServices[] = [sampleWithPartialData];
        expectedResult = service.addAppServicesToCollectionIfMissing(appServicesCollection, appServices);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appServices);
      });

      it('should add only unique AppServices to an array', () => {
        const appServicesArray: IAppServices[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const appServicesCollection: IAppServices[] = [sampleWithRequiredData];
        expectedResult = service.addAppServicesToCollectionIfMissing(appServicesCollection, ...appServicesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const appServices: IAppServices = sampleWithRequiredData;
        const appServices2: IAppServices = sampleWithPartialData;
        expectedResult = service.addAppServicesToCollectionIfMissing([], appServices, appServices2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appServices);
        expect(expectedResult).toContain(appServices2);
      });

      it('should accept null and undefined values', () => {
        const appServices: IAppServices = sampleWithRequiredData;
        expectedResult = service.addAppServicesToCollectionIfMissing([], null, appServices, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appServices);
      });

      it('should return initial array if no AppServices is added', () => {
        const appServicesCollection: IAppServices[] = [sampleWithRequiredData];
        expectedResult = service.addAppServicesToCollectionIfMissing(appServicesCollection, undefined, null);
        expect(expectedResult).toEqual(appServicesCollection);
      });
    });

    describe('compareAppServices', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAppServices(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAppServices(entity1, entity2);
        const compareResult2 = service.compareAppServices(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAppServices(entity1, entity2);
        const compareResult2 = service.compareAppServices(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAppServices(entity1, entity2);
        const compareResult2 = service.compareAppServices(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
