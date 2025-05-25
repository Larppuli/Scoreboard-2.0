import { getRefreshToken } from '@/app/lib/db';

export async function GET() {
  
  const refreshToken = await getRefreshToken();

  try {
    const tokenRes = await fetch('https://login.autodarts.io/realms/autodarts/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'autodarts-play',
        grant_type: 'refresh_token', 
        refresh_token: refreshToken!,
      }),
    });

    if (!tokenRes.ok) {
      return new Response(`Token fetch error: ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const apiRes = await fetch('https://api.autodarts.io/as/v0/matches/filter?size=10&page=0&sort=-finished_at', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!apiRes.ok) {
      return new Response(`API Error ${apiRes.status}: ${await apiRes.text()}`, { status: apiRes.status });
    }

    const data = await apiRes.json();
    return Response.json(data);

  } catch (error: any) {
    return new Response(`Unexpected error: ${error.message}`, { status: 500 });
  }
}
