export type Player = {
	imgUrl: string;
	name: string;
	displayName: string;
	password: string;
	ftUser: boolean;
	rookie: boolean;
	win: number;
	lose: number;
	level: number;
	exp: number;
	friends: string[];
	blockList: string[];
	twoFactorAuthenticationQR: string;
	isTwoFactorAuthenticationEnabled: boolean;
	status: string;
};
