import { View } from "react-native"
import { Text, Input, Icon, Button } from '@rneui/themed';
import { useStyles } from "../../../styles"
import { useWidgetStyles } from "./styles"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useCurrencies } from "../hooks";
import { useState } from "react"
import { useTheme } from "@rneui/themed";


export default ChangeExchangeRate = () => {
    const styles = useStyles();
    const widgetStyles = useWidgetStyles();
    const route = useRoute();
    const { theme } = useTheme();
    const { goBack, navigate } = useNavigation();
    const { defaultCurrencyCode, addNewCurrency } = useCurrencies();
    // Attention this exchangeRate is just used as local state for <TextInput>. 
    const [code1, setCode1] = useState(route.params.code);
    const [code2, setCode2] = useState(defaultCurrencyCode);
    const [exchangeRate, setExchangeRate] = useState('');
    const [error, setError] = useState("Please provide proper number");
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);

    const isValidationError = (text) => {
        if (text === '') {
            return { code: 1, message: 'Please provide a number' }
        }
        else // validation ok
        {
            return { code: 0, message: '' }
        }



    }

    return (
        <View style={[styles.container, { flexDirection: "column", alignItems: "center" }]}>
            <Text style={[widgetStyles.header, {}]}>{route.params.name}</Text>
            <Button
                radius={"sm"}
                type="solid"
                color={theme.colors.secondary}
                onPress={() => {
                    setCode1(code2);
                    setCode2(code1)
                }
                }
                icon={<Icon name="compare-arrows" color={'white'} />}
            />
            <Text style={{ textAlign: "center" }} > 100 {code1} =  {(exchangeRate * 100).toFixed(2)} {code2}</Text>
            <Text >Exchange rate from {code2} to {code1}: </Text>
            <Input
                label="Exchangerate"
                onChangeText={textValue => {
                    textValue = textValue.replace(/,/g, '.');
                    const validationResult = isValidationError(textValue)
                    if (!validationResult.code) {
                        setSubmitDisabled(false)
                    }
                    setError(validationResult.message);
                    setExchangeRate(textValue)
                }}
                value={exchangeRate?.toString()}
                keyboardType="numeric"
                placeholder="exchange rate"
                errorMessage={error}
            />
            <Button
                title={'Add'}
                titleStyle={{color: 'white'}}
                disabled={isSubmitDisabled}
                radius={"sm"}
                type="solid"
                color={isSubmitDisabled ? theme.colors.grey5 : theme.colors.secondary}
                onPress={() => {
                    addNewCurrency({currency :  {name: route.params.name, code: route.params.code, icon: route.params.icon, icon_type: route.params.icon_type}, exchangeRate: parseFloat(exchangeRate), baseCurrency: defaultCurrencyCode })
                    navigate('List_Currencies');
                }
                }
            />



        </View>

    )
}





