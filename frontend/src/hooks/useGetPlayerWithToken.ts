import { useCallback } from "react";

import axios from "axios";

import { constUrl } from "../constant/constUrl";
import { useLoginPlayer } from "./useLoginPlayer";
import { useNavigate } from "react-router";

//AccessTokenによりログインプレイヤーを特性し、loginPlayerに設定する

export const useGetPlayerwithToken = () => {
	const { setLoginPlayer } = useLoginPlayer();
	const navigate = useNavigate();

	const getPlayerWithToken = useCallback(() => {
		axios
			.post(
				constUrl.serversideUrl + `/players/bytoken`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"AccessToken"
						)}`,
					},
				}
			)
			.then((res) => {
				setLoginPlayer(res.data);
			})
			.catch(() => {
				navigate("/");
			});
	}, [navigate, setLoginPlayer]);
	return { getPlayerWithToken };
};
