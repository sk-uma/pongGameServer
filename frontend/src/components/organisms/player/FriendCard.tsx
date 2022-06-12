import { memo, VFC } from "react";
import {
	Box,
	Text,
	Avatar,
	AvatarBadge,
	Flex,
	Menu,
	MenuItem,
	MenuButton,
	MenuList,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, NotAllowedIcon, SunIcon } from "@chakra-ui/icons";
import axios from "axios";

import { constUrl } from "../../../constant/constUrl";
import { useGetPlayerwithToken } from "../../../hooks/useGetPlayerWithToken";

//Profile画面のフレンドリストを表示するコンポーネント

type Props = {
	loginName: string;
	imgUrl: string;
	name: string;
	displayName: string;
	level: number;
	isfriend: boolean;
	status: string;
};

export const FriendCard: VFC<Props> = memo((props) => {
	const { loginName, imgUrl, name, displayName, level, status, isfriend } =
		props;
	const { getPlayerWithToken } = useGetPlayerwithToken();

	const onClickUnFriend = () => {
		axios
			.delete(
				constUrl.serversideUrl +
					`/players/deletefriend/${loginName}/${name}`
			)
			.then(() => getPlayerWithToken());
	};

	const onClickBlock = () => {
		axios
			.patch(
				constUrl.serversideUrl + `/players/block/${loginName}/${name}`
			)
			.then(() => onClickUnFriend());
	};

	const onClickUnBlock = () => {
		axios
			.delete(
				constUrl.serversideUrl + `/players/unblock/${loginName}/${name}`
			)
			.then(() => getPlayerWithToken());
	};

	const onClickAddFriend = () => {
		axios
			.patch(
				constUrl.serversideUrl +
					`/players/addfriend/${loginName}/${name}`
			)
			.then(() => onClickUnBlock());
	};

	return (
		<Menu>
			<MenuButton>
				<Flex px={3}>
					<Avatar src={imgUrl}>
						<AvatarBadge
							boxSize="1.25em"
							bg={status === "LOGIN" ? "green.500" : "gray.300"}
						/>
					</Avatar>
					<Box
						ml="2"
						width="100px"
						bgColor="gray.200"
						borderRadius="5px"
					>
						<Text fontWeight="bold">{displayName}</Text>
						<Text fontSize="sm">Lv {level}</Text>
					</Box>
				</Flex>
			</MenuButton>
			{isfriend ? (
				<MenuList>
					<Text ml={3} color="gray">
						{`Status: ${status}`}
					</Text>
					<MenuItem onClick={onClickUnFriend} icon={<MinusIcon />}>
						Unfriend
					</MenuItem>
					<MenuItem onClick={onClickBlock} icon={<NotAllowedIcon />}>
						Block
					</MenuItem>
				</MenuList>
			) : (
				<MenuList>
					<Text ml={3} color="gray">
						Status
					</Text>
					<MenuItem onClick={onClickAddFriend} icon={<AddIcon />}>
						Add Friend
					</MenuItem>
					<MenuItem onClick={onClickUnBlock} icon={<SunIcon />}>
						UnBlock
					</MenuItem>
				</MenuList>
			)}
		</Menu>
	);
});
