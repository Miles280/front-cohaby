export interface Listing {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  id: number;
  title: string;
  description: string;
  pricePerNight: number;
  maxCapacity: number;
  owner: string;
  services: string[];
  equipments: string[];
  pictures: string[];
  bookings: string[];
  adress: string;
}
