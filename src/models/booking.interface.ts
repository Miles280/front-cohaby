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
  user: string;
  comments: string[];
}
