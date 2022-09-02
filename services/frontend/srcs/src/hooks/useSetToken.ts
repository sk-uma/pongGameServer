import { useCallback, useState } from "react";
import axios from "axios";

import { constUrl } from "../constant/constUrl";
import { useMessage } from "./useMessage";
import { useNavigate } from "react-router";
import { useGetPlayerwithToken } from "./useGetPlayerWithToken";

//通常ログインしたときにAccessTokenをlocalStorageに格納して、二要素認証画面に遷移させる

export const useSetToken = () => {
	const navigate = useNavigate();
	const { showMessage } = useMessage();
	const [loading, setLoading] = useState(false);
	const { getPlayerWithToken } = useGetPlayerwithToken();

	const setToken = useCallback(
		(name: string, password: string) => {
			setLoading(true);
			axios
				.post(constUrl.serversideUrl + `/players/token`, {
					name,
					password,
				})
				.then((resToken) => {
					localStorage.setItem(
						"AccessToken",
						resToken.data.accessToken
					);
					getPlayerWithToken();
					navigate("/tfa");
				})
				.catch(() => {
					showMessage({
						title: "That User Name or Password is wrong.",
						status: "error",
					});
					setLoading(false);
					navigate("/");
				});
		},
		[showMessage, setLoading, navigate, getPlayerWithToken]
	);
	return { setToken, loading };
};
