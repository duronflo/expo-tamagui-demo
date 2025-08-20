import { useState } from "react";
import SectionListExtended from "../../../components/sectionlistextended";
import DialogChoice from "../../../components/dialogChoice";
import { useCurrencies } from "../hooks";
import { useNavigation } from "@react-navigation/native";
import { Button, ListItem, Avatar, useTheme, FAB, Text } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View } from "react-native";
import { useStyles } from '../../../styles'
import AppActivityIndicator from "../../../components/AppActivityIndicator";
import { PENDING } from "../../../utilities/helper";

const currencyData = require("../../../../assets/data/currencies.json");

// helper component for having a proper configuration
export default CurrencyList = () => {
    const styles = useStyles();
    const { getDefaultCurrencyObject, defaultCurrencyCode, setDefaultCurrencyCode, usedCurrencies, getExchangeRate, status, removeCurrency } = useCurrencies();
    const { navigate } = useNavigation();
    const [visibleDialogChoice, setvisibleDialogChoice] = useState(false);
    const { theme } = useTheme();


    const printExchangeRate = (item) => {
        const exchRate = getExchangeRate(defaultCurrencyCode, item.code);
        if (exchRate) {
            return (`100 ${defaultCurrencyCode} = ${(100 * exchRate).toFixed(2)} ${item.code}`);
        }
        else {
            return (<Text style={{ color: theme.colors.error }} >Please add valid exchange rate here...</Text>)
        }
    }

    return (
        <View style={styles.container}>

            <ScrollView>
                <ListItem
                    bottomDivider
                    linearGradientProps={{
                        colors: [theme.colors.white, theme.colors.grey5],
                        start: { x: 1, y: 0 },
                        end: { x: 0.2, y: 0 },
                    }}
                    ViewComponent={LinearGradient}
                >

                    <ListItem.Content>
                        <ListItem.Title>Default Currency</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider
                    linearGradientProps={{
                        colors: [theme.colors.white, theme.colors.white],
                        start: { x: 1, y: 0 },
                        end: { x: 0.2, y: 0 },
                    }}
                    ViewComponent={LinearGradient}
                    onPress={() => setvisibleDialogChoice(true)}
                >

                    <Avatar
                        rounded
                        icon={{
                            name: getDefaultCurrencyObject().icon ? getDefaultCurrencyObject().icon : "money-bill",
                            type: getDefaultCurrencyObject().icon_type ? getDefaultCurrencyObject().icon_type : "font-awesome-5",
                            size: 20,
                        }}
                        containerStyle={{ backgroundColor: theme.colors.grey3  }}
                    />
                    <ListItem.Content>
                        <ListItem.Title>{getDefaultCurrencyObject().code} ({getDefaultCurrencyObject().name})</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider
                    linearGradientProps={{
                        colors: [theme.colors.white, theme.colors.grey5],
                        start: { x: 1, y: 0 },
                        end: { x: 0.2, y: 0 },
                    }}
                    ViewComponent={LinearGradient}
                >

                    <ListItem.Content>
                        <ListItem.Title>Used Currencies</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                {usedCurrencies
                    .filter((item) => item.code !== defaultCurrencyCode)
                    .map((item, index) => (
                        < ListItem.Swipeable
                            bottomDivider
                            linearGradientProps={{
                                colors: [theme.colors.white, theme.colors.white],
                                start: { x: 1, y: 0 },
                                end: { x: 0.2, y: 0 },
                            }}
                            ViewComponent={LinearGradient}
                            key={index}
                            onPress={() => navigate('Edit_Exchange_Rate', { code: item.code, name: item.name, icon: item.icon, icon_type: item.icon_type})}
                            rightContent={() => (
                                <Button
                                    containerStyle={{
                                        flex: 1,
                                        justifyContent: "center",
                                        backgroundColor: theme.colors.background,
                                    }}
                                    type="clear"
                                    icon={{ name: "delete-outline", color: 'white' }}
                                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                                    onPress={() => removeCurrency(item.code)}
                                />
                            )}
                        >

                            <Avatar
                                rounded
                                icon={{
                                    name: item.icon ? item.icon : "money-bill",
                                    type: item.icon_type ? item.icon_type : "font-awesome-5",
                                    size: 20,
                                }}
                                containerStyle={{ backgroundColor: theme.colors.grey3 }}
                            />
                            <ListItem.Content>
                                <ListItem.Title>{item.name} ({item.code})</ListItem.Title>
                                <ListItem.Subtitle>{printExchangeRate(item)}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron name='angle-left' type='font-awesome-5' />
                        </ListItem.Swipeable>
                    ))
                }
                <DialogChoice
                    visible={visibleDialogChoice}
                    setVisible={setvisibleDialogChoice}
                    title='Select default currency'
                    data={usedCurrencies}
                    checkedId={usedCurrencies.findIndex((item) => item.code === defaultCurrencyCode) + 1}
                    submit={setDefaultCurrencyCode}
                />

            </ScrollView >
            <FAB
                visible={true}
                placement="right"
                onPress={() => navigate('List_Other_Currencies')}
                icon={{ name: 'add', color: theme.colors.white }}
                color={theme.colors.secondary}
            />
        </View>

    )


};


