import { memo, VFC } from "react";
import { ChatHome } from "../chat/ChatHome";
import { ChatProvider } from "../chat/provider/ChatProvider";

export const Chat: VFC = memo(() => {
	return (
		<ChatProvider>
			<ChatHome />
		</ChatProvider>
	)
});