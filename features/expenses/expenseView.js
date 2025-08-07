import { useNavigation } from "@react-navigation/native"
import { useAuthentication } from "../../services/useAuthentication";
import { useUser } from "../user/hooks";
import { View } from "react-native"
import { useStyles } from "../../styles";
import { Button, ButtonGroup, Text, Tab, TabView, FAB, useTheme } from '@rneui/themed';
import { useEffect, useState } from "react";
import ListContainer from "./components/listContainer";
import DonutChartContainer from "./components/diagramContainer";
import { useCategories } from "../categories/hooks";
import { createCategoryMap, createEmotionMap, createDateMap } from './utilities'
import { useCurrencies } from "../currencies/hooks";
import { useExpenses } from "./hooks";

const emotions = require('../../../assets/data/emotions.json');
// comment out for now ... only demo data
// const demoExpenses = require('../../../assets/data/sampleExpenses.json')

export default function ExpenseView() {
    const styles = useStyles();
    const { navigate } = useNavigation();
    const { categories } = useCategories();
    const { expenses } = useExpenses()
    const [index, setIndex] = useState(0);
    const [selectedIndexList, setSelectedIndexList] = useState(0);
    const [selectedIndexDonut, setSelectedIndexDonut] = useState(0);

    const { theme } = useTheme();
    const { defaultCurrencyCode, getDefaultCurrencyObject, getExchangeRate } = useCurrencies();

    const [dateMap, setDateMap] = useState([]);
    const [emotionMap, setEmotionMap] = useState([]);
    const [categoryMap, setCategoryMap] = useState([]);
    const [totalAmountExpenses, setTotalAmountExpenses] = useState(0);

    //console.log(dateMap);
    //console.log(emotionMap);
    //console.log(categoryMap);

    useEffect(() => {
        if (expenses) {

            setDateMap(createDateMap(expenses, defaultCurrencyCode, getExchangeRate));
            setEmotionMap(createEmotionMap(expenses, emotions, defaultCurrencyCode, getExchangeRate));
            setCategoryMap(createCategoryMap(expenses, categories, defaultCurrencyCode, getExchangeRate));
            setTotalAmountExpenses(expenses.reduce((acc, currentValue) =>
                currentValue.currencyCode === getDefaultCurrencyObject().code ? acc + currentValue.amount : acc + currentValue.amount * getExchangeRate(currentValue.currencyCode, getDefaultCurrencyObject().code), 0));
        }
    }, [expenses, defaultCurrencyCode])


    return (
        <View style={styles.container}>
            <Text h4> 2025 </Text>
            <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-between', backgroundColor: theme.colors.background }}>
                <Button
                    containerStyle={{ flex: 1, backgroundColor: theme.colors.background}}
                    disableContainerStyle={{ backgroundColor: theme.colors.primary }}
                    buttonStyle={{  backgroundColor: theme.colors.background }}
                    titleStyle={{ color: theme.colors.black }}
                    disabledStyle={{ backgroundColor: theme.colors.primary }}
                    disabledTitleStyle={{ color: 'white' }}
                    title={'List'}
                    disabled={index === 0 ? true : false}
                    type="outline"
                    size="md"
                    onPress={() => setIndex(0)}
                />
                <View style={{flex:3, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text h6> Balance </Text>
                    <Text h4 style={totalAmountExpenses > 0 ? { color: 'lightgreen' } : { color: 'orange' }}> {totalAmountExpenses.toFixed(2)} {getDefaultCurrencyObject().code}</Text>
                </View>
                <Button
                    containerStyle={{ flex: 1,  backgroundColor: theme.colors.background  }}
                    buttonStyle={{ backgroundColor: theme.colors.background }}
                    titleStyle={{ color: theme.colors.black }}
                    disabledStyle={{ backgroundColor: theme.colors.primary }}
                    disabledTitleStyle={{ color: 'white' }}
                    title={'Donut'}
                    disabled={index === 1 ? true : false}
                    type="outline"
                    size="md"
                    onPress={() => setIndex(1)}
                />
            </View>


            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                disableIndicator={true}
                variant="default"
                containerStyle={{ backgroundColor: theme.colors.background, flex: 1 }}
            >

            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring" disableSwipe={false} containerStyle={{flex: 1}}>

                <TabView.Item style={{ backgroundColor: 'theme.colors.background', width: '100%' }}>
                    <View style={{ flex: 1, paddingBottom: 20 }}>
                        <ButtonGroup
                            buttonStyle={{ padding: 10, backgroundColor: theme.colors.background }}
                            selectedButtonStyle={{ backgroundColor: theme.colors.secondary }}
                            buttons={['Time', 'Category', 'MyMonji']}
                            selectedIndex={selectedIndexList}
                            onPress={setSelectedIndexList}
                            containerStyle={{ marginBottom: 20, borderColor: theme.colors.grey5 }}
                        />
                        {(() => {
                            switch (selectedIndexList) {
                                case 0:
                                    return dateMap ? (<ListContainer data={dateMap} type={'date'} />) : <></>;
                                case 1:
                                    return categoryMap ? (<ListContainer data={categoryMap} type={'category'} />) : <></>;
                                case 2:
                                    return emotionMap ? (<ListContainer data={emotionMap} type={'emotion'}  />) : <></>;
                            }

                        })()}

                    </View>
                </TabView.Item>
                <TabView.Item style={{ backgroundColor: theme.colors.background, width: '100%' }}>
                    <View>
                        <ButtonGroup
                            buttonStyle={{ padding: 10, backgroundColor: theme.colors.background }}
                            selectedButtonStyle={{ backgroundColor: theme.colors.secondary }}
                            buttons={['Category', 'MyMonji']}
                            selectedIndex={selectedIndexDonut}
                            onPress={setSelectedIndexDonut}
                            containerStyle={{ marginBottom: 20, borderColor: theme.colors.grey5 }}
                        />
                        {selectedIndexDonut === 0 ?
                            <DonutChartContainer
                                data={categoryMap.map(item => ({
                                    text: item.category,
                                    color: item.avatar_background,
                                    avatar_icon: item.avatar_icon,
                                    icon_type: item.icon_type,
                                    value: item.totalAmount / totalAmountExpenses * 100,
                                    totalAmount: item.totalAmount
                                }))}
                                pieSize={250}
                                isEmotionChart={false}
                                triggerResetSelectedPie={[selectedIndexDonut, index]}
                            />
                            :
                            <DonutChartContainer
                                data={emotionMap.map(item => ({
                                    text: item.name,
                                    color: item.avatar_background,
                                    avatar_icon: item.avatar_icon,
                                    icon_type: item.icon_type,
                                    value: item.totalAmount / totalAmountExpenses * 100,
                                    totalAmount: item.totalAmount
                                }))}
                                pieSize={250}
                                isEmotionChart={true}
                                triggerResetSelectedPie={[selectedIndexDonut, index]}
                            />
                        }
                    </View>

                </TabView.Item>
            </TabView>

            <View style={{ alignItems: 'center' }}>

                <FAB
                    title={''}
                    titleStyle={{ color: 'white' }}
                    size={'medium'}
                    visible={true}
                    placement='left'
                    onPress={() => navigate('Add_Expenses', { isIncome: true })}
                    icon={{ name: 'add', color: 'white' }}
                    color={'green'}
                />
                <FAB
                    title={''}
                    titleStyle={{ color: 'white' }}
                    size={'medium'}
                    visible={true}
                    placement='right'
                    onPress={() => navigate('Add_Expenses', { isIncome: false })}
                    icon={{ name: 'remove', color: 'white' }}
                    color={'orange'}
                />
            </View>


        </View>
    )
}

