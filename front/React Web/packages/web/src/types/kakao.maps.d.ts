declare namespace kakao.maps {
  export class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  export namespace services {
    export type CategoryGroupCode = 
      | 'MT1' | 'CS2' | 'PS3' | 'SC4' | 'AC5' | 'PK6' 
      | 'OL7' | 'SW8' | 'BK9' | 'CT1' | 'AG2' | 'PO3' 
      | 'AT4' | 'AD5' | 'FD6' | 'CE7' | 'HP8' | 'PM9';

    export interface PlacesSearchOptions {
      location?: kakao.maps.LatLng;
      radius?: number;
      sort?: kakao.maps.services.SortBy;
      category_group_code?: CategoryGroupCode | CategoryGroupCode[];
    }

    export class Places {
      categorySearch(
        code: CategoryGroupCode,
        callback: (
          result: any[],
          status: kakao.maps.services.Status,
          pagination: kakao.maps.services.Pagination
        ) => void,
        options?: PlacesSearchOptions
      ): void;
    }

    export enum Status {
      OK = "OK",
      ZERO_RESULT = "ZERO_RESULT",
      ERROR = "ERROR"
    }

    export enum SortBy {
      DISTANCE = "DISTANCE"
    }

    export interface Pagination {
      current: number;
      first: number;
      last: number;
      hasNext: boolean;
      hasPrev: boolean;
    }
  }
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}