import { SignJWT, jwtVerify } from 'jose';
import { User } from '../types';

const JWT_SECRET = new TextEncoder().encode(
  import.meta.env.VITE_JWT_SECRET || 'your-secret-key'
);

// Dynamically add the Google platform script
const script = document.createElement('script');
script.src = "https://apis.google.com/js/platform.js";
script.async = true;
script.defer = true;
document.head.appendChild(script);

// Dynamically add the Google Sign-In meta tag
const meta = document.createElement('meta');
meta.name = "google-signin-client_id";
meta.content = "958125216777-sfq8vbofr6bfd9lnu1rlugevbqavihgr.apps.googleusercontent.com";
document.head.appendChild(meta);

export async function createSession(user: User): Promise<string> {
  const jwt = await new SignJWT({ 
    sub: user.id, 
    email: user.email,
    name: user.name,
    role: user.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Extend token validity to 7 days
    .sign(JWT_SECRET);
  
  return jwt;
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function googleSignIn() {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: 'code',
    scope: 'email profile',
    prompt: 'select_account'
  });

  window.location.href = `${googleAuthUrl}?${params.toString()}`;
}