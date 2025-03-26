interface TokenCache {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  expires_in: number;
}

const AUTH0_DOMAIN = "auth.audiense.com";
const AUTH0_CLIENT_ID = "VnZfWVa4DxvYo8giPW2vdUelDPlqQAkC";
const AUTH0_AUDIENCE = "eXyVAChcg4ihvbYnM1ZW0SReEfIEVo5F";


export class AuthClient {
  private static instance: AuthClient | null = null;
  private tokenCache: TokenCache | null = null;
  private deviceCodeResponse: DeviceCodeResponse | null;

  private constructor() {
    this.tokenCache = null;
    this.deviceCodeResponse = null;
  }

  public static getInstance(): AuthClient {
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient();
    }
    return AuthClient.instance;
  }

  async getAccessToken(): Promise<string> {
    // If we have a device code response but no valid token, try to get the token
    if (this.deviceCodeResponse && !this.tokenCache) {
      await this.saveAccessTokenWithDeviceCode();
      return this.getAccessTokenFromCache();
    }

    // If token has expired, try to refresh it
    if (this.tokenHasExpired()) {
      await this.refreshTokenCache();
    }

    return this.getAccessTokenFromCache();
  }


  private resetTokenCache() {
    this.tokenCache = null;
  }

  public async saveAccessTokenWithDeviceCode(): Promise<void> {
    try {
      const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          client_id: AUTH0_CLIENT_ID,
          device_code: this.getDeviceCodeFromCache()
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Save access token with device code failed: ${error}`);
      }

      const data = await response.json() as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
      };

      this.tokenCache = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in * 1000) - 60000 // Subtract 1 minute for safety
      };
    } catch (error) {
      throw error;
    }
  }

  private async refreshTokenCache(): Promise<void> {
    try {
      const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          client_id: AUTH0_CLIENT_ID,
          refresh_token: this.getRefreshTokenFromCache()
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Auth0 token refresh failed: ${error}`);
      }

      const data = await response.json() as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
      };

      this.tokenCache = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in * 1000) - 60000 // Subtract 1 minute for safety
      };
    } catch (error) {
      console.error(`[AuthClient] Error refreshing token:`, error);
      this.resetTokenCache();
    }
  }

  private getAccessTokenFromCache(): string {
    if (!this.tokenCache) {
      throw new Error('No token cache available');
    }
    return this.tokenCache.access_token;
  }

  private getDeviceCodeFromCache(): string {
    if (!this.deviceCodeResponse) {
      throw new Error('No device code response available');
    }
    return this.deviceCodeResponse.device_code;
  }

  private getRefreshTokenFromCache(): string {
    if (!this.tokenCache) {
      throw new Error('No token cache available');
    }
    return this.tokenCache.refresh_token;
  }

  private tokenHasExpired(): boolean {
    if (!this.tokenCache) {
      return true;
    }
    return this.tokenCache.expires_at < Date.now();
  }

  /**
   * Initiates the Device Authorization Flow by requesting a device code
   * @returns Promise containing the device code response with user_code, device_code, and verification_uri
   */
  async requestDeviceCode(): Promise<DeviceCodeResponse> {
    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_AUDIENCE) {
      throw new Error('Missing required environment variables for device authorization');
    }

    try {
      const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/device/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: AUTH0_CLIENT_ID,
          scope: 'offline_access',
          audience: AUTH0_AUDIENCE,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Device code request failed: ${error}`);
      }

      const data: DeviceCodeResponse = await response.json() as {
        device_code: string;
        user_code: string;
        verification_uri: string;
        verification_uri_complete: string;
        expires_in: number;
        interval: number;
      };

      this.deviceCodeResponse = data;

      return data;
    } catch (error) {
      console.error(`[AuthClient] Error requesting device code:`, error);
      throw error;
    }
  }



}