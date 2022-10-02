//URL関連定数

type _constUrl = {
	frontendUrl: string;
	serversideUrl: string;
	ftApiAuthUrl: string;
	ftGetTokenAPI: string;
	ftClientId: string;
	ftClientSecret: string;
	ftGetMeAPI: string;
};

export const constUrl: _constUrl = {
	//Reactフロントエンド側URL
	frontendUrl: "http://localhost:3000",
	//NestJSサーバーサイド側URL
	serversideUrl: "http://localhost:3001",
	//42Authorizationを通して、ReactフロントエンドにアクセスするURL
	ftApiAuthUrl: process.env.REACT_APP_FT_API_AUTH_URL || "",
	//42AuthorizationのAPI Token
	ftGetTokenAPI: "https://api.intra.42.fr/oauth/token",
	//42AuthorazationのClientId
	ftClientId: process.env.REACT_APP_FT_CLIENT_ID || "",
	//42AuthorazationのSecret
	ftClientSecret: process.env.REACT_APP_FT_CLIENT_SECRET || "",
	//42ログインユーザーの自身の情報を得るためのAPI
	ftGetMeAPI: "https://api.intra.42.fr/v2/me",
} as const;
