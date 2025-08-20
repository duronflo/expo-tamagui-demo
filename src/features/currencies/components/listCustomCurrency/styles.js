import {  makeStyles } from '@rneui/themed';

export const useWidgetStyles = makeStyles((theme) => ({
    button: {
        flexDirection: "row",
        borderColor: "black",
        borderWidth: 1,
        margin: 5,
        padding: 5,
        borderCurve: 5
    },
    buttonHighlighted: {
        flexDirection: "row",
        backgroundColor: 'green',
        borderColor: "black",
        borderWidth: 1,
        margin: 5,
        padding: 5,
        borderCurve: 5
    }
}));


