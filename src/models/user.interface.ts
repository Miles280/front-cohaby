export interface User {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  id: number;
  email: string;
  roles: string[];
  password: string;
  firstname: string;
  lastname: string;
  pseudo: string;
  birthdate: string;
  inscriptionDate: string;
  gender: 'male' | 'female' | string;
  profilPicture: string;
  adress: string;
  listings: string[];
  bookings: string[];
  messagesSent: string[];
  messagesReceived: string[];
  userIdentifier: string;
}
