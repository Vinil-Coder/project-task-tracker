export interface AuthState {
    error: string | null;
    loggedIn: boolean,
    user: any;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface LoginInterface {
    email: string,
    password: string
}

export interface RegisterInterface {
    name: string,
    email: string,
    mobilenumber: string,
    password: string
}

