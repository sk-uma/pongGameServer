import { memo, VFC, useCallback } from "react";
import { Flex, Heading, Box, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export const Header: VFC = memo(() => {
	const navigate = useNavigate();

	const onClickHome = useCallback(() => {
		navigate("/home");
	}, [navigate]);
	const onClickChat = useCallback(() => {
		navigate("/home/chat");
	}, [navigate]);
	const onClickGame = useCallback(() => {
		navigate("/home/game");
	}, [navigate]);
	const onClickPlayers = useCallback(() => {
		navigate("/home/players");
	}, [navigate]);
	const onClickLogout = useCallback(() => {
		navigate("/");
	}, [navigate]);

	return (
		<>
			<Flex
				as="nav"
				bg="teal.500"
				color="gray.50"
				align="center"
				justify="space-between"
				padding={{ base: 3, md: 5 }}
			>
				<Flex
					align="center"
					as="a"
					mr={8}
					_hover={{ cursor: "pointer" }}
				>
					<Heading
						as="h1"
						fontSize={{ base: "md", md: "lg" }}
						onClick={onClickHome}
					>
						42_transcendence
					</Heading>
				</Flex>
				<Flex
					align="center"
					fontSize="sm"
					flexGrow={2}
					display={{ base: "flex", md: "flex" }}
				>
					<Box pr={4}>
						<Link onClick={onClickChat}>Chat</Link>
					</Box>
					<Box pr={4}>
						<Link onClick={onClickGame}>Game</Link>
					</Box>
					<Box pr={4}>
						<Link onClick={onClickPlayers}>Players</Link>
					</Box>
					<Box pr={4}>
						<Link onClick={onClickLogout}>Log Out</Link>
					</Box>
				</Flex>
			</Flex>
		</>
	);
});
