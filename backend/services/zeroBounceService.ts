export interface ZeroBounceResponse {
  email: string;
  status: string;
  sub_status: string;
  free_email: boolean;
  did_you_mean: string | null;
  account: string;
  domain: string;
  domain_age_days: string | null;
  smtp_provider: string | null;
  error: string | null;
}

export class ZeroBounceService {
  private static apiKey = process.env.ZEROBOUNCE_API_KEY;

  public static async validateEmail(email: string): Promise<{ valid: boolean; reason: string }> {
    // If API key is missing or is the placeholder value, warn and allow.
    if (!this.apiKey || this.apiKey === "placeholder" || this.apiKey === "<your-api-key>") {
      console.warn("ZEROBOUNCE_API_KEY is not defined in the environment. Skipping validation.");
      return { valid: true, reason: "" };
    }

    try {
      const url = `https://api.zerobounce.net/v2/validate?api_key=${this.apiKey}&email=${encodeURIComponent(email)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ZeroBounce API returned HTTP ${response.status}`);
      }

      const data = (await response.json()) as ZeroBounceResponse;

      if (data.error) {
        throw new Error(`ZeroBounce Error: ${data.error}`);
      }

      const status = data.status.toLowerCase();

      switch (status) {
        case "invalid":
          return { valid: false, reason: "The email address is invalid and does not exist." };
        case "disposable":
          return { valid: false, reason: "Disposable or temporary email addresses are not allowed." };
        case "spamtrap":
          return { valid: false, reason: "The email address is flagged as a spam trap." };
        case "abuse":
          return { valid: false, reason: "The email address is associated with spam complaints." };
        case "do_not_mail":
          return { valid: false, reason: "The email address is marked as do-not-mail." };
        case "catch-all":
          return { valid: false, reason: "Catch-all email addresses are not allowed. Please use a specific personal or business email." };
        case "unknown":
          return { valid: false, reason: "We could not verify the existence of this email address at this time." };
        case "valid":
          return { valid: true, reason: "" };
        default:
          return { valid: true, reason: "" };
      }
    } catch (error: any) {
      console.error("ZeroBounce validation error:", error);
      return {
        valid: false,
        reason: "Failed to validate email address. Please try again later."
      };
    }
  }
}
