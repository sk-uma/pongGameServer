import { memo, VFC } from "react";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { PlayerEditProfile } from "../organisms/player/PlayerEditProfile";
import { Center, Spinner } from "@chakra-ui/react";

export const EditProfile: VFC = memo(() => {
	const { loginPlayer } = useLoginPlayer();

	if (loginPlayer) {
		return <PlayerEditProfile name={loginPlayer.name} />;
	} else {
		return (
			<Center h="100vh">
				<Spinner />
			</Center>
		);
	}
});
