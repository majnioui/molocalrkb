import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHealthAndVersion } from '../health-and-version.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../health-and-version.test-samples';

import { HealthAndVersionService } from './health-and-version.service';

const requireRestSample: IHealthAndVersion = {
  ...sampleWithRequiredData,
};

describe('HealthAndVersion Service', () => {
  let service: HealthAndVersionService;
  let httpMock: HttpTestingController;
  let expectedResult: IHealthAndVersion | IHealthAndVersion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HealthAndVersionService);
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

    it('should create a HealthAndVersion', () => {
      const healthAndVersion = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(healthAndVersion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HealthAndVersion', () => {
      const healthAndVersion = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(healthAndVersion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HealthAndVersion', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HealthAndVersion', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HealthAndVersion', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHealthAndVersionToCollectionIfMissing', () => {
      it('should add a HealthAndVersion to an empty array', () => {
        const healthAndVersion: IHealthAndVersion = sampleWithRequiredData;
        expectedResult = service.addHealthAndVersionToCollectionIfMissing([], healthAndVersion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(healthAndVersion);
      });

      it('should not add a HealthAndVersion to an array that contains it', () => {
        const healthAndVersion: IHealthAndVersion = sampleWithRequiredData;
        const healthAndVersionCollection: IHealthAndVersion[] = [
          {
            ...healthAndVersion,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHealthAndVersionToCollectionIfMissing(healthAndVersionCollection, healthAndVersion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HealthAndVersion to an array that doesn't contain it", () => {
        const healthAndVersion: IHealthAndVersion = sampleWithRequiredData;
        const healthAndVersionCollection: IHealthAndVersion[] = [sampleWithPartialData];
        expectedResult = service.addHealthAndVersionToCollectionIfMissing(healthAndVersionCollection, healthAndVersion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(healthAndVersion);
      });

      it('should add only unique HealthAndVersion to an array', () => {
        const healthAndVersionArray: IHealthAndVersion[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const healthAndVersionCollection: IHealthAndVersion[] = [sampleWithRequiredData];
        expectedResult = service.addHealthAndVersionToCollectionIfMissing(healthAndVersionCollection, ...healthAndVersionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const healthAndVersion: IHealthAndVersion = sampleWithRequiredData;
        const healthAndVersion2: IHealthAndVersion = sampleWithPartialData;
        expectedResult = service.addHealthAndVersionToCollectionIfMissing([], healthAndVersion, healthAndVersion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(healthAndVersion);
        expect(expectedResult).toContain(healthAndVersion2);
      });

      it('should accept null and undefined values', () => {
        const healthAndVersion: IHealthAndVersion = sampleWithRequiredData;
        expectedResult = service.addHealthAndVersionToCollectionIfMissing([], null, healthAndVersion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(healthAndVersion);
      });

      it('should return initial array if no HealthAndVersion is added', () => {
        const healthAndVersionCollection: IHealthAndVersion[] = [sampleWithRequiredData];
        expectedResult = service.addHealthAndVersionToCollectionIfMissing(healthAndVersionCollection, undefined, null);
        expect(expectedResult).toEqual(healthAndVersionCollection);
      });
    });

    describe('compareHealthAndVersion', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHealthAndVersion(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHealthAndVersion(entity1, entity2);
        const compareResult2 = service.compareHealthAndVersion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHealthAndVersion(entity1, entity2);
        const compareResult2 = service.compareHealthAndVersion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHealthAndVersion(entity1, entity2);
        const compareResult2 = service.compareHealthAndVersion(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
