import { redirect } from 'next/navigation';

export default function AgencyRoot() {
  // Voor nu sturen we de root van de agency door naar de login, 
  // of direct naar /ceo of /klanten op basis van hun sessie. 
  // Dit kan later een publieke one-pager/verkooppagina worden.
  redirect('/auth/login');
}
