// create User

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
