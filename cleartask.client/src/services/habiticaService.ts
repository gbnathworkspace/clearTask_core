/**
 * HabiticaService - A TypeScript service to interact with the Habitica API
 *
 * This service allows you to fetch user data from Habitica using API credentials
 */
interface HabiticaCredentials {
  userId: string;
  apiToken: string;
}

interface HabiticaUser {
  _id: string;
  auth: {
    local: {
      username: string;
    };
  };
  profile: {
    name: string;
  };
  // Other user properties as needed
}

export class HabiticaService {
  private readonly baseUrl = "https://habitica.com/api/v3";
  private credentials: HabiticaCredentials | null = null;

  constructor(credentials: HabiticaCredentials) {
    this.credentials = credentials;
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "x-api-user": this.credentials?.userId || "",
      "x-api-key": this.credentials?.apiToken || "",
    };
  }

  async getCurrentUser(): Promise<HabiticaUser> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: "GET",
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data from Habitica");
      }
      const data = await response.json();
      return data.data as HabiticaUser;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  async getUserName(): Promise<string> {
    const user = await this.getCurrentUser();

    return user.profile.name || "Unknown User";
  }
}
