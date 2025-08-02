export interface Comment {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  id: number;
  content: string;
  rating: number;
  sentAt: string;
  booking: string;
  author: string;
}
