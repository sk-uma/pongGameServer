import { useContext } from "react";

import {
	LoginPlayerContext,
	LoginPlayerContextType,
} from "../providers/LoginPlayerProvider";

//グローバルスコープでloginPlayerを取得するためのhooks

export const useLoginPlayer = (): LoginPlayerContextType =>
	useContext(LoginPlayerContext);
