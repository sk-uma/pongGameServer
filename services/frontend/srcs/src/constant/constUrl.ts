//URL関連定数

export const constUrl = {
	//Reactフロントエンド側URL
	frontendUrl: "http://localhost:3000",
	//NestJSサーバーサイド側URL
	serversideUrl: "http://localhost:3001",
	//42Authorizationを通して、ReactフロントエンドにアクセスするURL
	ftApiAuthUrl:
		//		"https://api.intra.42.fr/oauth/authorize?client_id=5ec7a9808358afbd8a4a174c7d89d4ae27fc87b35477bf1065cc11387df68549&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhome&response_type=code",
		"https://api.intra.42.fr/oauth/authorize?client_id=3dab4327c691ea017b61965e590dfda08b58d6ae74e0a26a0dab87c222444569&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftfa&response_type=code",
	//42AuthorizationのAPI Token
	ftGetTokenAPI: "https://api.intra.42.fr/oauth/token",
	//42AuthorazationのClientId
	ftClientId:
		"3dab4327c691ea017b61965e590dfda08b58d6ae74e0a26a0dab87c222444569",
	//42AuthorazationのSecret
	ftClientSecret:
		"8f39bf5a9636c19786e97fbe06bd6f494dffc760df3ab9e055b623be623ff2a6",
	//42ログインユーザーの自身の情報を得るためのAPI
	ftGetMeAPI: "https://api.intra.42.fr/v2/me",
} as const;
