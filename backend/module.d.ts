/* eslint-disable prettier/prettier */
declare namespace NodeJS {
	export interface ProcessEnv {
		DATABASE_URL:string;
		jwtSecretKey:string;
		jwtRefreshTokenKey:string;
	}

	export interface JwtPayload {
    email: string;
    sub: {
        name: string;
        role: string; 
    };

}
}


