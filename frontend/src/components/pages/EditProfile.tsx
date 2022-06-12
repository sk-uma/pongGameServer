import { memo, VFC } from "react";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { PlayerEditProfile } from "../organisms/player/PlayerEditProfile";
import { Center, Spinner } from "@chakra-ui/react";

//プロフィール編集ページ

export const EditProfile: VFC = memo(() => {
	const { loginPlayer } = useLoginPlayer();

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
