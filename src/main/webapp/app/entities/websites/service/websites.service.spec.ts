import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWebsites } from '../websites.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../websites.test-samples';

import { WebsitesService } from './websites.service';

const requireRestSample: IWebsites = {
  ...sampleWithRequiredData,
};

describe('Websites Service', () => {
  let service: WebsitesService;
  let httpMock: HttpTestingController;
  let expectedResult: IWebsites | IWebsites[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WebsitesService);
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

    it('should create a Websites', () => {
      const websites = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(websites).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Websites', () => {
      const websites = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(websites).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Websites', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Websites', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Websites', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWebsitesToCollectionIfMissing', () => {
      it('should add a Websites to an empty array', () => {
        const websites: IWebsites = sampleWithRequiredData;
        expectedResult = service.addWebsitesToCollectionIfMissing([], websites);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(websites);
      });

      it('should not add a Websites to an array that contains it', () => {
        const websites: IWebsites = sampleWithRequiredData;
        const websitesCollection: IWebsites[] = [
          {
            ...websites,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWebsitesToCollectionIfMissing(websitesCollection, websites);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Websites to an array that doesn't contain it", () => {
        const websites: IWebsites = sampleWithRequiredData;
        const websitesCollection: IWebsites[] = [sampleWithPartialData];
        expectedResult = service.addWebsitesToCollectionIfMissing(websitesCollection, websites);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(websites);
      });

      it('should add only unique Websites to an array', () => {
        const websitesArray: IWebsites[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const websitesCollection: IWebsites[] = [sampleWithRequiredData];
        expectedResult = service.addWebsitesToCollectionIfMissing(websitesCollection, ...websitesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const websites: IWebsites = sampleWithRequiredData;
        const websites2: IWebsites = sampleWithPartialData;
        expectedResult = service.addWebsitesToCollectionIfMissing([], websites, websites2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(websites);
        expect(expectedResult).toContain(websites2);
      });

      it('should accept null and undefined values', () => {
        const websites: IWebsites = sampleWithRequiredData;
        expectedResult = service.addWebsitesToCollectionIfMissing([], null, websites, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(websites);
      });

      it('should return initial array if no Websites is added', () => {
        const websitesCollection: IWebsites[] = [sampleWithRequiredData];
        expectedResult = service.addWebsitesToCollectionIfMissing(websitesCollection, undefined, null);
        expect(expectedResult).toEqual(websitesCollection);
      });
    });

    describe('compareWebsites', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWebsites(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWebsites(entity1, entity2);
        const compareResult2 = service.compareWebsites(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWebsites(entity1, entity2);
        const compareResult2 = service.compareWebsites(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWebsites(entity1, entity2);
        const compareResult2 = service.compareWebsites(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
