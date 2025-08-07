
import { useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, Text, View } from "react-native";
import styles from "../../../../styles";
import stylesWidget from "./styles";

// helper component for having a proper configuration
export default CustomCurrencyList = ({ onPress, currencyData, elementHighlight}) => {
    const { goBack } = useNavigation();
    return (
        <FlatList
            data={currencyData}
            renderItem={({ item }) => {

                return (
                    <View style={styles.container }>
                        <Pressable
                            style={(elementHighlight === item.code ) ? stylesWidget.buttonHighlighted : stylesWidget.button}
                            onPress={() => {
                                onPress(item.code);
                                goBack();
                            }}>
                            <Text style={{ flex: 1 }}>{item.name}</Text>
                            <Text style={{ flex: 2 }}>{item.code}</Text>
                        </Pressable>
                    </View>
                )
            }}
        />)


};