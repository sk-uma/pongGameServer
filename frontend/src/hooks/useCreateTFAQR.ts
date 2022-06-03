import { useCallback } from "react";
import axios from "axios";

import { constUrl } from "../constant/constUrl";

//プレイヤーの新規作成時に二要素認証用のシークレットとQRコードを生成するhooks

export const useCreateTFAQR = () => {
	const CreateTFAQR = useCallback(
		(name: string, password: string) =>
			axios
				.post(constUrl.serversideUrl + `/players/token`, {
					name,
					password,
				})
				.then((resToken) => {
					axios.post(
						constUrl.serversideUrl + `/2fa/create`,
						{},
						{
							headers: {
								Authorization: `Bearer ${resToken.data.accessToken}`,
							},
						}
					);
				}),
		[]
	);
	return { CreateTFAQR };
};
