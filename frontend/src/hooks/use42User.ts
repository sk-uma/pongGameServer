import { useCallback } from "react";
import axios from "axios";
import { useLoginPlayer } from "./useLoginPlayer";
import { useMessage } from "./useMessage";
import { useNavigate } from "react-router";
import { constUrl } from "../constant/constUrl";

const getToken = (code: string) =>
	axios.post(constUrl.ftGetTokenAPI, {
		grant_type: "authorization_code",
		client_id: constUrl.ftClientId,
		client_secret: constUrl.ftClientSecret,
		code: code,
		redirect_uri: constUrl.frontendUrl + "/home",
	});

const getMe = (accessToken: string) =>
	axios.get(constUrl.ftGetMeAPI, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

const getPlayers = (playerName: string) =>
	axios.get(constUrl.serversideUrl + `/players/${playerName}`);

const create42Player = (playerName: string, imgUrl: string) =>
	axios.post(constUrl.serversideUrl + `/players`, {
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
			axios.post(
				constUrl.serversideUrl + `/avatar/${playerName}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
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
