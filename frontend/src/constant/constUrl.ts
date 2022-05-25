export const constUrl = {
	frontendUrl: "http://localhost:3000",
	serversideUrl: "http://localhost:3001",
	ftApiAuthUrl:
		"https://api.intra.42.fr/oauth/authorize?client_id=5ec7a9808358afbd8a4a174c7d89d4ae27fc87b35477bf1065cc11387df68549&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhome&response_type=code",
	ftGetTokenAPI: "https://api.intra.42.fr/oauth/token",
	ftClientId:
		"5ec7a9808358afbd8a4a174c7d89d4ae27fc87b35477bf1065cc11387df68549",
	ftClientSecret:
		"811b6f2ae3b9ccb0fb01fe47113e2189280f6daa0a4ecadf082d3c1cd96670d6",
	ftGetMeAPI: "https://api.intra.42.fr/v2/me",
} as const;
