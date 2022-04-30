import { useContext } from "react";

import {
	LoginPlayerContext,
	LoginPlayerContextType,
} from "../providers/LoginPlayerProvider";

export const useLoginPlayer = (): LoginPlayerContextType =>
	useContext(LoginPlayerContext);
