import { Address } from './address.interface';

export interface User {
  '@id': string;
  '@type': string;
  id: number;
  email: string;
  roles: string[];
  firstname: string;
  lastname: string;
  pseudo: string;
  birthdate: string;
  inscriptionDate: string;
  gender: 'male' | 'female' | 'other';
  profilPicture: string;
  address: Address;
}
