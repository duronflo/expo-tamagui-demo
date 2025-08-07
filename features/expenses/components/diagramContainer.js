import { View, Pressable } from "react-native";
import React, { useEffect, useState } from 'react';
import {
    Text,
    Avatar,
    useTheme,
} from '@rneui/themed';
import { useStyles } from '../../../styles'
import Pie from './DonutChart/DonutChart'



// two types of charts are implemented, one for emotion (isEmotionChart  === true) and one for category (isEmotionChart === false)
export const DonutChartContainer = ({ data, triggerResetSelectedPie, pieSize = 250, isEmotionChart = true }) => {

    const resetSelectedPie = () => ({
        index: -1,
        text: 'Total',
        totalAmount: data.reduce((acc, currentValue) => acc + currentValue.totalAmount, 0),
        color: theme.colors.background
    })

    const styles = useStyles();
    const { theme } = useTheme();
    const [selectedPie, setSelectedPie] = useState(resetSelectedPie());

    useEffect(() => {
        setSelectedPie(resetSelectedPie());
    }, [triggerResetSelectedPie])

    const onPieItemSelected = newIndex => () => {
        if (selectedPie.index !== newIndex) {
            setSelectedPie({
                index: newIndex,
                text: data[newIndex].text,
                number: data[newIndex].value,
                color: data[newIndex].color,
                totalAmount: data[newIndex].totalAmount
            });
        }
        else {
            setSelectedPie(resetSelectedPie());
        }
    }

    const LegendComponent = ({ data }) => {
        return (

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 5, justifyContent: 'space-evenly', gap: 5 }}>
                {data.map((item, i) =>
                    (isEmotionChart ? <></> : i < 12) && <Pressable
                        key={`${i}_${item.name}_${data.date || data.emotion || data.category}`}
                        style={{
                            backgroundColor: i === selectedPie.index ? theme.colors.primary : theme.colors.background,
                            borderRadius: 3,
                            borderWidth: 1,
                            borderColor: i === selectedPie.index ? theme.colors.primary : theme.colors.grey5,
                            alignItems: 'center',
                            flexDirection: 'row',
                            padding: 5,
                        }}
                        onPress={onPieItemSelected(i)}
                    >
                        <Avatar
                            size={isEmotionChart ? 30 : 25}
                            rounded
                            icon={{ name: item.avatar_icon, type: item.icon_type }}
                            containerStyle={{ backgroundColor: item.color }}
                        />
                        <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
                            <Text
                                style={{ fontSize: 14, margin: 3, color: i === selectedPie.index ? 'white' : theme.colors.black }}>
                                {item.text}
                            </Text>
                            <Text
                                style={{ fontSize: 11, textAlign: 'center', color: i === selectedPie.index ? 'white' : theme.colors.black }}>
                                {Math.round(item.value)}%
                            </Text>
                        </View>
                    </Pressable>
                )}
            </View>
        )
    };



    return (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ margin: 5 }}>
                <Pie
                    pieSize={pieSize * 0.9}
                    onItemSelected={onPieItemSelected}
                    size={pieSize}
                    data={data}
                    value={selectedPie}
                />
            </View>

            <LegendComponent data={data} />
        </View>





    );
};



export default DonutChartContainer;










