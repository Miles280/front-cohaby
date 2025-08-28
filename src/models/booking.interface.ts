import { User } from './user.interface';

export interface Booking {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  id: number;
  beginningDate: string;
  totalNights: number;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  nbrGuests: number;
  totalPrice: number;
  listing: string;
  user: User;
  comments: string[];
}
