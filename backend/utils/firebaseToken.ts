import jwt from "jsonwebtoken";

let googlePublicKeys: Record<string, string> = {};
let keysExpiry = 0;

async function getGooglePublicKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  if (now < keysExpiry && Object.keys(googlePublicKeys).length > 0) {
    return googlePublicKeys;
  }

  try {
    const res = await fetch(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch Google public keys: ${res.statusText}`);
    }

    const cacheControl = res.headers.get("cache-control") || "";
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) * 1000 : 3600000;

    googlePublicKeys = (await res.json()) as Record<string, string>;
    keysExpiry = now + maxAge;
    return googlePublicKeys;
  } catch (error) {
    console.error("Error fetching Google public keys:", error);
    if (Object.keys(googlePublicKeys).length > 0) {
      return googlePublicKeys;
    }
    throw error;
  }
}

export interface DecodedFirebaseToken {
  uid: string;
  email: string;
  name?: string;
  email_verified?: boolean;
  picture?: string;
  [key: string]: any;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedFirebaseToken> {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "nuvlo-3552c";

  const decodedHeader = jwt.decode(idToken, { complete: true });
  if (!decodedHeader || typeof decodedHeader === "string" || !decodedHeader.header?.kid) {
    throw new Error("Invalid Firebase ID token format");
  }

  const kid = decodedHeader.header.kid;
  const publicKeys = await getGooglePublicKeys();
  const publicKeyCert = publicKeys[kid];

  if (!publicKeyCert) {
    throw new Error(`Firebase signature key not found for kid: ${kid}`);
  }

  const decoded = jwt.verify(idToken, publicKeyCert, {
    algorithms: ["RS256"],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
  }) as DecodedFirebaseToken;

  return decoded;
}
