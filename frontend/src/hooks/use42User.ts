import { useCallback } from "react";
import axios from "axios";
import { useLoginPlayer } from "./useLoginPlayer";
import { useMessage } from "./useMessage";
import { useNavigate } from "react-router";

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

const create42Avatar = (playerName: string, imgUrl: string) =>
	fetch(imgUrl)
		.then((res) => res.blob())
		.then((blob) => {
			const formData = new FormData();
			formData.append("file", blob, `${playerName}.jpg`);
			axios.post(`http://localhost:3001/avatar/${playerName}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
		});

export const use42User = () => {
	const { setLoginPlayer } = useLoginPlayer();
	const { showMessage } = useMessage();

	const navigate = useNavigate();

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
										navigate("/home");
									})
									.catch(() => {
										create42Player(
											Me.data.login,
											Me.data.image_url
										)
											.then((res) => {
												create42Avatar(
													Me.data.login,
													Me.data.image_url
												).then(() => {
													setLoginPlayer(res.data);
													showMessage({
														title: "42 Authorization Successful and Player Created",
														status: "success",
													});
													navigate("/home");
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
		[setLoginPlayer, showMessage, navigate]
	);
	return { getFtUser };
};
