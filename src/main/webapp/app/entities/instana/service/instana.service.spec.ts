import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInstana } from '../instana.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../instana.test-samples';

import { InstanaService } from './instana.service';

const requireRestSample: IInstana = {
  ...sampleWithRequiredData,
};

describe('Instana Service', () => {
  let service: InstanaService;
  let httpMock: HttpTestingController;
  let expectedResult: IInstana | IInstana[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InstanaService);
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

    it('should create a Instana', () => {
      const instana = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(instana).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Instana', () => {
      const instana = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(instana).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Instana', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Instana', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Instana', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInstanaToCollectionIfMissing', () => {
      it('should add a Instana to an empty array', () => {
        const instana: IInstana = sampleWithRequiredData;
        expectedResult = service.addInstanaToCollectionIfMissing([], instana);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(instana);
      });

      it('should not add a Instana to an array that contains it', () => {
        const instana: IInstana = sampleWithRequiredData;
        const instanaCollection: IInstana[] = [
          {
            ...instana,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInstanaToCollectionIfMissing(instanaCollection, instana);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Instana to an array that doesn't contain it", () => {
        const instana: IInstana = sampleWithRequiredData;
        const instanaCollection: IInstana[] = [sampleWithPartialData];
        expectedResult = service.addInstanaToCollectionIfMissing(instanaCollection, instana);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(instana);
      });

      it('should add only unique Instana to an array', () => {
        const instanaArray: IInstana[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const instanaCollection: IInstana[] = [sampleWithRequiredData];
        expectedResult = service.addInstanaToCollectionIfMissing(instanaCollection, ...instanaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const instana: IInstana = sampleWithRequiredData;
        const instana2: IInstana = sampleWithPartialData;
        expectedResult = service.addInstanaToCollectionIfMissing([], instana, instana2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(instana);
        expect(expectedResult).toContain(instana2);
      });

      it('should accept null and undefined values', () => {
        const instana: IInstana = sampleWithRequiredData;
        expectedResult = service.addInstanaToCollectionIfMissing([], null, instana, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(instana);
      });

      it('should return initial array if no Instana is added', () => {
        const instanaCollection: IInstana[] = [sampleWithRequiredData];
        expectedResult = service.addInstanaToCollectionIfMissing(instanaCollection, undefined, null);
        expect(expectedResult).toEqual(instanaCollection);
      });
    });

    describe('compareInstana', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInstana(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInstana(entity1, entity2);
        const compareResult2 = service.compareInstana(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInstana(entity1, entity2);
        const compareResult2 = service.compareInstana(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInstana(entity1, entity2);
        const compareResult2 = service.compareInstana(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
