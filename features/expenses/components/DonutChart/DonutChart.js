import React, { useState, useEffect, color } from "react";
import { View, Pressable } from "react-native";
import { Svg, G } from "react-native-svg"; // from "react-native-svg"
import { pie } from "d3-shape";
import { makeStyles, useTheme, Text } from '@rneui/themed';
import PieSlice from "./DonutSlice";
import { useCurrencies } from "../../../currencies/hooks";

const Pie = ({ value, data, size, pieSize, onItemSelected }) => {
    const styles = useWidgetStyles();
    const [arcs, setArcs] = useState(null);
    const { theme } = useTheme();
    const {defaultCurrencyCode} = useCurrencies(); 

    useEffect(() => {
        const calculatedArcs = pie().sort(null).value(item => item.value)(data);
        setArcs(calculatedArcs);
    }, [data, pieSize]);

    return (
        arcs && (
            <View>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <G transform={`translate(${size / 2}, ${size / 2})`}>
                        {arcs.map(({ data }, index) => {
                            return (
                                <PieSlice
                                    key={`pie_shape_${index}`}
                                    color={data.color}
                                    onSelected={onItemSelected(index)}
                                    arcData={arcs[index]}
                                    isActive={value.index === index}
                                    donutSize={pieSize}
                                />
                            )
                        })}
                    </G>
                </Svg>

                <Pressable
                    style={[styles.donutContainer,
                    {
                        backgroundColor: value.color,
                        top: pieSize / 4 + pieSize / 18,
                        left: pieSize / 4 + pieSize / 18,
                        width: pieSize / 2,
                        height: pieSize / 2,
                        borderRadius: pieSize / 4
                    }]}
                    onPress={() => alert('hallo')}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        backgroundColor: theme.colors.white,
                        borderRadius: 100,
                        margin: 10,

                    }}
                    >

                        <Text
                            style={[styles.donutInnerText, {
                                color: theme.colors.black,
                                fontSize: 25,
                                fontWeight: 'bold',
                                padding: 1
                            }]}
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            width={70}
                            height={20}
                        >{value.text}
                        </Text>
                        <Text
                            style={[styles.donutInnerText, {
                                color: theme.colors.black,
                                fontSize: 15,
                                padding: 5
                            }]}
                        >{value.index === -1 ? '' : Math.round(value.number) + '%'}
                        </Text>
                        <View style={{
                            paddingHorizontal: 6,
                            paddingVertical: 1,
                            backgroundColor: theme.colors.grey5,
                            borderRadius: 15
                        }}>
                            <Text
                                style={[styles.donutInnerText, {
                                    color: theme.colors.warning,
                                    fontSize: 15
                                }]}
                            >{value.totalAmount.toFixed(2)} {defaultCurrencyCode}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        )
    );
};

export default Pie;


export const useWidgetStyles = makeStyles((theme) => ({
    donutContainer: {
        position: 'absolute',
        top: 55,
        left: 55,
        width: 90,
        height: 90,
        backgroundColor: 'green',
        borderRadius: 45

    },

    donutInnerText: {
        fontSize: 15,
        textAlign: 'center'

    }
}));