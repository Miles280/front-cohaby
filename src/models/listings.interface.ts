import { Address } from './address.interface';
import { Equipment } from './equipment.interface';
import { Picture } from './picture.interface';
import { Service } from './service.interface';
import { User } from './user.interface';

export interface Listing {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  id: number;
  title: string;
  description: string;
  pricePerNight: number;
  maxCapacity: number;
  owner: User;
  services: Service[];
  equipments: Equipment[];
  pictures: Picture[];
  address: Address;
}
