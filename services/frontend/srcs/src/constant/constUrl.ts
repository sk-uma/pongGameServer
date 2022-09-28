//URL関連定数

export const constUrl = {
	//Reactフロントエンド側URL
	frontendUrl: "http://localhost:3000",
	//NestJSサーバーサイド側URL
	serversideUrl: "http://localhost:3001",
	//42Authorizationを通して、ReactフロントエンドにアクセスするURL
	ftApiAuthUrl:
		"https://api.intra.42.fr/oauth/authorize?client_id=3dab4327c691ea017b61965e590dfda08b58d6ae74e0a26a0dab87c222444569&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftfa&response_type=code",
	//42AuthorizationのAPI Token
	ftGetTokenAPI: "https://api.intra.42.fr/oauth/token",
	//42AuthorazationのClientId
	ftClientId:
		"3dab4327c691ea017b61965e590dfda08b58d6ae74e0a26a0dab87c222444569",
	//42AuthorazationのSecret 期限2022/10/24
	ftClientSecret:
		"40af4c790ca53c6685780408aa4f9e06d7b2f286ee0181eba7f642648dd59970",
	//42ログインユーザーの自身の情報を得るためのAPI
	ftGetMeAPI: "https://api.intra.42.fr/v2/me",
} as const;
