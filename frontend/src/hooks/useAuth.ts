import { useCallback, useState } from "react";
import axios from "axios";
import { Player } from "../types/api/Player";
import { useNavigate } from "react-router-dom";
import { useMessage } from "./useMessage";
import { useLoginPlayer } from "..//hooks/useLoginPlayer";
import { constUrl } from "../constant/constUrl";
import { useGetToken } from "./useGetToken";

//通常ログインをしてloginPlayerにログイン情報を格納するhooks

export const useAuth = () => {
	const navigate = useNavigate();
	const { showMessage } = useMessage();
	const { setLoginPlayer } = useLoginPlayer();
	const { GetToken } = useGetToken();

	const [loading, setLoading] = useState(false);

	const login = useCallback(
		(name: string, password: string) => {
			setLoading(true);
			axios
				.post<Player>(constUrl.serversideUrl + `/players/signin`, {
					name,
					password,
				})
				.then((res) => {
					setLoginPlayer({ ...res.data });
					GetToken(name, password);
					showMessage({
						title: "Sign In Successful",
						status: "success",
					});
					navigate("/home");
				})
				.catch(() => {
					showMessage({
						title: "That User Name or Password is wrong.",
						status: "error",
					});
					setLoading(false);
				});
		},
		[navigate, showMessage, setLoginPlayer, setLoading, GetToken]
	);
	return {
		login,
		loading,
	};
};
