import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInfraTopology } from '../infra-topology.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../infra-topology.test-samples';

import { InfraTopologyService } from './infra-topology.service';

const requireRestSample: IInfraTopology = {
  ...sampleWithRequiredData,
};

describe('InfraTopology Service', () => {
  let service: InfraTopologyService;
  let httpMock: HttpTestingController;
  let expectedResult: IInfraTopology | IInfraTopology[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InfraTopologyService);
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

    it('should create a InfraTopology', () => {
      const infraTopology = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(infraTopology).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InfraTopology', () => {
      const infraTopology = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(infraTopology).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InfraTopology', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InfraTopology', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InfraTopology', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInfraTopologyToCollectionIfMissing', () => {
      it('should add a InfraTopology to an empty array', () => {
        const infraTopology: IInfraTopology = sampleWithRequiredData;
        expectedResult = service.addInfraTopologyToCollectionIfMissing([], infraTopology);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(infraTopology);
      });

      it('should not add a InfraTopology to an array that contains it', () => {
        const infraTopology: IInfraTopology = sampleWithRequiredData;
        const infraTopologyCollection: IInfraTopology[] = [
          {
            ...infraTopology,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInfraTopologyToCollectionIfMissing(infraTopologyCollection, infraTopology);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InfraTopology to an array that doesn't contain it", () => {
        const infraTopology: IInfraTopology = sampleWithRequiredData;
        const infraTopologyCollection: IInfraTopology[] = [sampleWithPartialData];
        expectedResult = service.addInfraTopologyToCollectionIfMissing(infraTopologyCollection, infraTopology);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(infraTopology);
      });

      it('should add only unique InfraTopology to an array', () => {
        const infraTopologyArray: IInfraTopology[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const infraTopologyCollection: IInfraTopology[] = [sampleWithRequiredData];
        expectedResult = service.addInfraTopologyToCollectionIfMissing(infraTopologyCollection, ...infraTopologyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const infraTopology: IInfraTopology = sampleWithRequiredData;
        const infraTopology2: IInfraTopology = sampleWithPartialData;
        expectedResult = service.addInfraTopologyToCollectionIfMissing([], infraTopology, infraTopology2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(infraTopology);
        expect(expectedResult).toContain(infraTopology2);
      });

      it('should accept null and undefined values', () => {
        const infraTopology: IInfraTopology = sampleWithRequiredData;
        expectedResult = service.addInfraTopologyToCollectionIfMissing([], null, infraTopology, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(infraTopology);
      });

      it('should return initial array if no InfraTopology is added', () => {
        const infraTopologyCollection: IInfraTopology[] = [sampleWithRequiredData];
        expectedResult = service.addInfraTopologyToCollectionIfMissing(infraTopologyCollection, undefined, null);
        expect(expectedResult).toEqual(infraTopologyCollection);
      });
    });

    describe('compareInfraTopology', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInfraTopology(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInfraTopology(entity1, entity2);
        const compareResult2 = service.compareInfraTopology(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInfraTopology(entity1, entity2);
        const compareResult2 = service.compareInfraTopology(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInfraTopology(entity1, entity2);
        const compareResult2 = service.compareInfraTopology(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
