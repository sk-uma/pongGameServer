import { memo, VFC, useEffect } from "react";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { PlayerEditProfile } from "../organisms/player/PlayerEditProfile";
import { Center, Spinner } from "@chakra-ui/react";
import { useResetLoginPlayer } from "../../hooks/useResetLoginPlayer";

//プロフィール編集ページ

export const EditProfile: VFC = memo(() => {
	const { loginPlayer } = useLoginPlayer();
	//Reloadした場合など、loginPlayer情報が失われた時LoginPlayerを再設定
	const { resetLoginPlayer } = useResetLoginPlayer();

	useEffect(() => {
		loginPlayer && localStorage.setItem("loginName", loginPlayer.name);
		!loginPlayer && localStorage.getItem("loginName") && resetLoginPlayer();
		//		eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetLoginPlayer]);

	if (loginPlayer) {
		return (
			<PlayerEditProfile
				name={loginPlayer.name}
				isTFA={loginPlayer.isTwoFactorAuthenticationEnabled}
				ftUser={loginPlayer.ftUser}
				TFAQR={loginPlayer.twoFactorAuthenticationQR}
			/>
		);
	} else {
		return (
			<Center h="100vh">
				<Spinner />
			</Center>
		);
	}
});
