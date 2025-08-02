export interface Message {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  id: number;
  content: string;
  sendAt: string;
  isRead: boolean;
  sender: string;
  receiver: string;
  read: boolean;
}
