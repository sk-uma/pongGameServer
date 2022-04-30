import { useCallback } from "react";
import axios from "axios";
import { useLoginPlayer } from "./useLoginPlayer";
import { useMessage } from "./useMessage";

const getToken = (code: string) =>
	axios.post("https://api.intra.42.fr/oauth/token", {
		grant_type: "authorization_code",
		client_id:
			"5ec7a9808358afbd8a4a174c7d89d4ae27fc87b35477bf1065cc11387df68549",
		client_secret:
			"811b6f2ae3b9ccb0fb01fe47113e2189280f6daa0a4ecadf082d3c1cd96670d6",
		code: code,
		redirect_uri: "http://localhost:3000/home",
	});

const getMe = (accessToken: string) =>
	axios.get("https://api.intra.42.fr/v2/me", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

const getPlayers = (playerName: string) =>
	axios.get(`http://localhost:3001/players/${playerName}`);

const create42Player = (playerName: string, imgUrl: string) =>
	axios.post(`http://localhost:3001/players`, {
		name: playerName,
		imgUrl: imgUrl,
		password: "42user",
		ftUser: true,
	});

export const use42User = () => {
	const { setLoginPlayer } = useLoginPlayer();
	const { showMessage } = useMessage();

	const getFtUser = useCallback(
		(code: string | null) => {
			if (code) {
				getToken(code)
					.then((tokenRes) => {
						getMe(tokenRes.data.access_token)
							.then((Me) => {
								getPlayers(Me.data.login)
									.then((res) => {
										setLoginPlayer(res.data);
										showMessage({
											title: "42 Authorization Successful",
											status: "success",
										});
									})
									.catch(() => {
										create42Player(
											Me.data.login,
											Me.data.image_url
										)
											.then((res) => {
												setLoginPlayer(res.data);
												showMessage({
													title: "42 Authorization Successful and Player Created",
													status: "success",
												});
											})
											.catch(() =>
												console.log(
													"Cannot create 42player"
												)
											);
									});
							})
							.catch(() => console.log("Not Found Me"));
					})
					.catch(() => console.log("Not Found AccessToken"));
			}
		},
		[setLoginPlayer, showMessage]
	);
	return { getFtUser };
};
