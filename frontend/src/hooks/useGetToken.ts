import { useCallback } from "react";
import axios from "axios";

import { constUrl } from "../constant/constUrl";

export const useGetToken = () => {
	const GetToken = useCallback((name: string, password: string) => {
		axios
			.post(constUrl.serversideUrl + `/players/token`, {
				name,
				password,
			})
			.then((resToken) => {
				localStorage.setItem("AccessToken", resToken.data.accessToken);
			});
	}, []);
	return { GetToken };
};
