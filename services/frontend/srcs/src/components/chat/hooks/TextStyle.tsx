import { Box, Text } from "@chakra-ui/react";


export function TextMainStyle(
    props: {
        title: String,
        color: string,
    }) {
    return (
    <>
        <Box style={{marginTop: '10px', marginLeft: '5px'}}>
            <Text as="b" color={props.color}
                style={{
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}>
                {props.title}
            </Text>
        </Box>
    </>
    );
}

export function TextSubStyle(
    props: {
        title: String,
        isCurrentRoom?: boolean,
    }) {
    return (
    <>
        { !props.isCurrentRoom &&
        <Box  style={{marginLeft: '5px'}}>
            <Text color='gray.300'
                style={{
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}>
                {props.title}
            </Text>
        </Box>
        }
        {
            props.isCurrentRoom &&
            <Box  style={{marginLeft: '5px'}} bg='teal.100'>
            <Text color='gray.300' 
                style={{
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}>
                {props.title}
            </Text>
        </Box>
        }
    </>
    );
}

export function TextSubHighlightStyle(
    props: {
        title: String,
        color: string,
    }) {
    return (
    <>
        <Box  style={{marginLeft: '5px'}}>
            <Text color={props.color}
                style={{
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}>
                {props.title}
            </Text>
        </Box>
    </>
    );
}

