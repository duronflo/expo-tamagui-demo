import { useCurrencies } from "../hooks";
import { useNavigation } from "@react-navigation/native";
import { ListItem, Avatar, useTheme, FAB, Text } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View } from "react-native";
import { useStyles } from '../../../styles';
import { reduceArrayDuplicates } from '../../../utilities/helper';

const currencyData = require("../../../../assets/data/currencies.json");

// helper component for having a proper configuration
export default CurrencyList = () => {
    const styles = useStyles();
    const { navigate } = useNavigation();
    const { theme } = useTheme();
    const {usedCurrencies} = useCurrencies();


    const redOtherCurrencies = reduceArrayDuplicates(currencyData, usedCurrencies);


    return (
        <View style={styles.container}>

            <ScrollView>
                {redOtherCurrencies
                    .map((item, index) => (
                        < ListItem
                            bottomDivider
                            linearGradientProps={{
                                colors: [theme.colors.white, theme.colors.white],
                                start: { x: 1, y: 0 },
                                end: { x: 0.2, y: 0 },
                            }}
                            ViewComponent={LinearGradient}
                            key={index}
                            onPress={() => navigate('Add_Currency', {code: item.code, name: item.name, icon: item.icon, icon_type: item.icon_type})}
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
                            </ListItem.Content>
                        </ListItem>
                    ))
                }

            </ScrollView >
        </View>

    )


};


