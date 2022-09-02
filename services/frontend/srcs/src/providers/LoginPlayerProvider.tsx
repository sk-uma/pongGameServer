import {
	createContext,
	Dispatch,
	SetStateAction,
	ReactNode,
	useState,
} from "react";

import { Player } from "../types/api/Player";

//useLoginPlayer:グローバルスコープでloginPlayerを取得するためのhooksをしようするための
//Contextを設定

type LoginPlayer = Player;

export type LoginPlayerContextType = {
	loginPlayer: LoginPlayer | null;
	setLoginPlayer: Dispatch<SetStateAction<LoginPlayer | null>>;
};

export const LoginPlayerContext = createContext<LoginPlayerContextType>(
	{} as LoginPlayerContextType
);

export const LoginPlayerProvider = (props: { children: ReactNode }) => {
	const { children } = props;
	const [loginPlayer, setLoginPlayer] = useState<LoginPlayer | null>(null);

	return (
		<>
			<LoginPlayerContext.Provider
				value={{ loginPlayer, setLoginPlayer }}
			>
				{children}
			</LoginPlayerContext.Provider>
		</>
	);
};
