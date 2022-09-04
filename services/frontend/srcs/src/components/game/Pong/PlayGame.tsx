import { Center } from "@chakra-ui/react";
import { Pong } from "./Pong";

export function PlayGame(props: {mode: string, gameType: string, privateKey?: string}) {
    return (
        <Center>
            <Pong
                mode={props.mode}
                gameType={props.gameType}
                privateKey={props.privateKey}
            />
        </Center>
    )
}