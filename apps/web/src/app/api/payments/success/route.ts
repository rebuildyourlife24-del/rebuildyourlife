import { NextResponse } from 'next/server';


// Redirect pagina na succesvolle betaling
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan') || 'PREMIUM';

  // Redirect naar dashboard met success bericht
  return NextResponse.redirect(
    new URL(`/dashboard?upgraded=${plan}&welcome=true`, request.url)
  );
}
