import { memo, VFC } from "react";
import {
	Box,
	Stack,
	Text,
	Avatar,
	AvatarBadge,
	Menu,
	MenuItem,
	MenuButton,
	MenuList,
} from "@chakra-ui/react";
import {
	AddIcon,
	MinusIcon,
	NotAllowedIcon,
	SunIcon,
	SettingsIcon,
} from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router";

import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { useResetLoginPlayer } from "../../../hooks/useResetLoginPlayer";
import { constUrl } from "../../../constant/constUrl";
import { useMessage } from "../../../hooks/useMessage";

//簡易的なユーザー情報をカードで表示するコンポーネント

type Props = {
	imgUrl: string;
	name: string;
	displayName: string;
	win: number;
	lose: number;
	level: number;
	exp: number;
};

export const PlayerCard: VFC<Props> = memo((props) => {
	const { imgUrl, name, displayName, win, lose, level, exp } = props;
	const { loginPlayer } = useLoginPlayer();
	const { resetLoginPlayer } = useResetLoginPlayer();
	const { showMessage } = useMessage();
	const navigate = useNavigate();

	const onClickUnFriend = () => {
		axios
			.delete(
				constUrl.serversideUrl +
					`/players/deletefriend/${loginPlayer?.name}/${name}`
			)
			.then(() => {
				resetLoginPlayer();
				showMessage({
					title: `${name}, Unfriend Successful`,
					status: "success",
				});
			});
	};

	const onClickBlock = () => {
		axios
			.patch(
				constUrl.serversideUrl +
					`/players/block/${loginPlayer?.name}/${name}`
			)
			.then(() => {
				if (loginPlayer?.friends.includes(name)) {
					onClickUnFriend();
				} else {
					resetLoginPlayer();
				}
				showMessage({
					title: `${name}, Block Successful`,
					status: "success",
				});
			});
	};

	const onClickUnBlock = () => {
		axios
			.delete(
				constUrl.serversideUrl +
					`/players/unblock/${loginPlayer?.name}/${name}`
			)
			.then(() => {
				resetLoginPlayer();
				showMessage({
					title: `${name}, Unblock Successful`,
					status: "success",
				});
			});
	};

	const onClickAddFriend = () => {
		axios
			.patch(
				constUrl.serversideUrl +
					`/players/addfriend/${loginPlayer?.name}/${name}`
			)
			.then(() => {
				if (loginPlayer?.blockList.includes(name)) {
					onClickUnBlock();
				} else {
					resetLoginPlayer();
				}
				showMessage({
					title: `${name}, Add Friend Successful`,
					status: "success",
				});
			});
	};

	const onClickEditProfile = () => {
		navigate("/home/edit");
	};

	return (
		<Menu>
			<MenuButton>
				<Box
					w="260px"
					h="300px"
					bg="white"
					borderRadius="10px"
					shadow="md"
					p={4}
				>
					<Stack textAlign="center">
						<Avatar
							src={imgUrl}
							boxSize="160px"
							m="auto"
							name={displayName}
						>
							<AvatarBadge boxSize="50px" bg="green.500" />
						</Avatar>
						<Text fontSize="lg" fontWeight="bold">
							{displayName}
						</Text>
						<Text fontSize="md" fontWeight="bold">
							{`LEVEL: ${level}`}
						</Text>
						<Text fontSize="sm" color="gray">
							{`Win: ${win} Lose: ${lose} Exp: ${exp}`}
						</Text>
					</Stack>
				</Box>
			</MenuButton>
			<MenuList>
				<Text ml={3} color="gray">
					Status
				</Text>
				{!loginPlayer?.friends.includes(name) &&
					loginPlayer?.name !== name && (
						<MenuItem onClick={onClickAddFriend} icon={<AddIcon />}>
							Add Friend
						</MenuItem>
					)}
				{loginPlayer?.blockList.includes(name) && (
					<MenuItem onClick={onClickUnBlock} icon={<SunIcon />}>
						UnBlock
					</MenuItem>
				)}
				{loginPlayer?.friends.includes(name) && (
					<MenuItem onClick={onClickUnFriend} icon={<MinusIcon />}>
						Unfriend
					</MenuItem>
				)}
				{!loginPlayer?.blockList.includes(name) &&
					loginPlayer?.name !== name && (
						<MenuItem
							onClick={onClickBlock}
							icon={<NotAllowedIcon />}
						>
							Block
						</MenuItem>
					)}
				{loginPlayer?.name === name && (
					<MenuItem
						onClick={onClickEditProfile}
						icon={<SettingsIcon />}
					>
						Edit Profile
					</MenuItem>
				)}
			</MenuList>
		</Menu>
	);
});
