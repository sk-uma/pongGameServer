import { useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import { constUrl } from "../constant/constUrl";
import { useCreateTFAQR } from "./useCreateTFAQR";
import { useGetPlayerwithToken } from "./useGetPlayerWithToken";
import { useMessage } from "./useMessage";

//42Authoraizationを使用して、ログインし、loginPlayerにそのユーザー情報を格納するhooks
//ユーザーがまだ登録済みでない場合は新規にユーザー情報を作成する。
//通常ログインの場合(codeが空の場合)はなにもしない

//Token取得
const get42Token = (code: string) =>
	axios.post(constUrl.ftGetTokenAPI, {
		grant_type: "authorization_code",
		client_id: constUrl.ftClientId,
		client_secret: constUrl.ftClientSecret,
		code: code,
		redirect_uri: constUrl.frontendUrl + "/tfa",
	});

//Tokenから42User情報取得
const getMe = (accessToken: string) =>
	axios.get(constUrl.ftGetMeAPI, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

//Player情報取得
const getPlayers = (playerName: string) =>
	axios.get(constUrl.serversideUrl + `/players/${playerName}`);

//新規42Userの登録
const create42Player = (playerName: string, imgUrl: string) =>
	axios.post(constUrl.serversideUrl + `/players`, {
		name: playerName,
		imgUrl: imgUrl,
		password: "42user",
		ftUser: true,
	});

//新規42Userのアバター情報登録
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

const getAndSetToken = (name: string, password: string) =>
	axios
		.post(constUrl.serversideUrl + `/players/token`, {
			name,
			password,
		})
		.then((resToken) => {
			localStorage.setItem("AccessToken", resToken.data.accessToken);
		});

export const use42SetToken = () => {
	const { CreateTFAQR } = useCreateTFAQR();
	const { getPlayerWithToken } = useGetPlayerwithToken();
	const { showMessage } = useMessage();
	const navigate = useNavigate();

	const setFtUserToken = useCallback(
		(code: string | null) => {
			if (code) {
				get42Token(code)
					.then((tokenRes) => {
						getMe(tokenRes.data.access_token)
							.then((Me) => {
								getPlayers(Me.data.login)
									.then((user) => {
										if (user.data.ftUser === false) {
											showMessage({
												title: `"${user.data.name}" is alredy exist. Sorry, you cannot use "42 Authorization".`,
												status: "error",
											});
											navigate("/");
										} else {
											getAndSetToken(
												Me.data.login,
												"42user"
											).then(() => {
												getPlayerWithToken();
											});
										}
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
													CreateTFAQR(
														Me.data.login,
														"42user"
													).then(() => {
														getAndSetToken(
															Me.data.login,
															"42user"
														).then(() => {
															getPlayerWithToken();
														});
													});
												});
											})
											.catch((e) => {
												showMessage({
													title: `Sorry, ${e.response.data.message}`,
													status: "error",
												});
												navigate("/");
											});
									});
							})
							.catch((e) => {
								showMessage({
									title: `Sorry, ${e.response.data.message}`,
									status: "error",
								});
								navigate("/");
							});
					})
					.catch((e) => {
						showMessage({
							title: `Sorry, ${e.response.data.message}`,
							status: "error",
						});
						navigate("/");
					});
			}
		},
		[CreateTFAQR, getPlayerWithToken, navigate, showMessage]
	);
	return { setFtUserToken };
};
