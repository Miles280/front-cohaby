export interface address {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  id: number;
  street: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  users: string[];
  listings: string[];
}
