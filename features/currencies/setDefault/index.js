
import { View, Pressable} from "react-native"
import CustomCurrencyList from "../components/listCustomCurrency"
import { useCurrencies } from "../hooks"
import stylesWidget from "./styles"
import { useNavigation } from "@react-navigation/native"
import Ionicons from '@expo/vector-icons/Ionicons';

export default SetDefaultCurrency = () => {
        const { defaultCurrencyCode, setDefaultCurrencyCode, usedCurrencies} = useCurrencies();
        const {goBack} = useNavigation();
        return (
                <View>
                        <CustomCurrencyList
                                onPress={setDefaultCurrencyCode}
                                currencyData={usedCurrencies}
                                elementHighlight={defaultCurrencyCode}
                        />
                        <Pressable onPress={() => goBack()}
                                style={stylesWidget.button}>
                                <Ionicons name="arrow-back" size={24} color="black" />
                        </Pressable>
                </View>
        )
}