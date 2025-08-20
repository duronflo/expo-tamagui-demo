import { useNavigation } from "@react-navigation/native"
import { Pressable, Platform, View } from 'react-native'
import { FAB, Text, Button, useTheme, Slider, Icon, Input } from '@rneui/themed'
import { useStyles } from "../../../styles";
import { useState, useEffect } from "react";
import { useCurrencies } from "../../currencies/hooks";
import { useCategories } from "../../categories/hooks";
import { useExpenses } from "../hooks";
import DialogChoice from "../../../components/dialogChoice"
import DateTimePickerModal from "react-native-modal-datetime-picker";


function EmotionSlider(props = {}) {
    const { emotionRate, setEmotionRate, minimumValue, maximumValue, styles } = props;
    const interpolate = (start, end) => {
        const newMinimumValue = minimumValue + 10;
        const newMaximumValue = maximumValue + 10;
        const newEmotionRate = emotionRate + 10;
        let k = (newEmotionRate - newMinimumValue) / newMaximumValue; // 0 =>min  && 10 => MAX
        return Math.ceil((1 - k) * start + k * end) % 256;
    };

    const color = () => {
        let r = interpolate(255, 0);
        let g = interpolate(0, 255);
        let b = interpolate(0, 0);
        return `rgb(${r},${g},${b})`;
    };

    return (
        <View style={{ margin: 5, ...styles }}>
            <Text>Emotion: {emotionRate}</Text>
            <Slider
                style={{ marginVertical: 5, marginHorizontal: 20 }}
                value={emotionRate}
                onValueChange={setEmotionRate}
                maximumValue={maximumValue}
                minimumValue={minimumValue}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                    children: (
                        <Icon
                            name="heartbeat"
                            type="font-awesome"
                            size={20}
                            reverse
                            containerStyle={{ bottom: 20, right: 20 }}
                            color={color()}
                        />
                    ),
                }}
            />

        </View>
    )

}


function CategoryChoice({ categories, setCategory }) {
    const { theme } = useTheme();
    return <View style={{ flex: 3 }}>
        <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {categories.map((item, i) =>
                <Button
                    title={item.name}
                    type={'outline'}
                    key={i + item.name}
                    raised={false}
                    titleProps={{
                        numberOfLines: 1
                    }}
                    titleStyle={{
                        fontSize: 12,
                        margin: 0,
                        textAlign: 'justify',
                    }}
                    containerStyle={{
                        width: 70,
                        height: 70,
                        minHeigh: 100,
                        margin: 2,
                        backgroundColor: theme.colors.backgroundColor,
                    }}
                    icon={{
                        name: item.avatar_icon,
                        type: item.icon_type,
                        size: 15,
                        color: item.avatar_background,
                    }}
                    iconPosition={'top'}
                    iconContainerStyle={{ margin: 10 }}
                    onPress={() => setCategory(item.name)}
                />
            )}

        </View>
    </View>;
}

function CalcDial({ amount, setAmount }) {
    const { theme } = useTheme();

    function numClickHandler(item) {
        if (amount === '0')
            setAmount(item)
        else
            if (amount[amount.length - 3] === ',')
                setAmount(amount)
            else
                setAmount(amount + item);
    }

    function commaClickHandler(item) {
        amount.includes(item) ? setAmount(amount) : setAmount(amount + item);
    }

    function ButtonRow(props = {}) {
        const { buttons } = props;

        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: theme.colors.background }}>
                {buttons.map((item, i) =>
                    <Button
                        key={`${item.title}_i`}
                        titleStyle={{
                            fontSize: 35,
                            margin: 2,

                        }}
                        buttonStyle={{
                            borderRadius: 40,
                        }}
                        containerStyle={{
                            flex: 1,
                            margin: 7
                        }}

                        title={item.title}
                        onPress={item.onPress}
                        raised={false}

                    />
                )}

            </View>
        )

    }
    return <View style={{ flex: 3, flexDirection: 'column', justifyContent: 'space-around' }}>
        <ButtonRow buttons={[
            { title: '1', onPress: () => numClickHandler('1') },
            { title: '2', onPress: () => numClickHandler('2') },
            { title: '3', onPress: () => numClickHandler('3') },
        ]} />
        <ButtonRow buttons={[
            { title: '4', onPress: () => numClickHandler('4') },
            { title: '5', onPress: () => numClickHandler('5') },
            { title: '6', onPress: () => numClickHandler('6') },
        ]} />
        <ButtonRow buttons={[
            { title: '7', onPress: () => numClickHandler('7') },
            { title: '8', onPress: () => numClickHandler('8') },
            { title: '9', onPress: () => numClickHandler('9') },
        ]} />
        <ButtonRow buttons={[
            { title: '0', onPress: () => numClickHandler('0') },
            { title: ',', onPress: () => commaClickHandler(',') },
        ]} />
    </View>;
}



export default function ExpenseChangeForm(props = {}) {

    const { isIncome, expense } = props;
    const { navigate } = useNavigation();
    const { lastCurrencyCode, setLastCurrencyCode, usedCurrencies } = useCurrencies();
    const { categories } = useCategories();
    const { theme } = useTheme();
    const [amount, setAmount] = useState('0');
    const [currency, setCurrency] = useState(lastCurrencyCode);
    const [date, setDate] = useState(new Date());
    const [textInput, setTextInput] = useState('');
    const [visibleCategoryDialog, setVisibleCategoryDialog] = useState(false);
    const [category, setCategory] = useState('')
    const [emotionRate, setEmotionRate] = useState(0);
    const [visibleLastCurrencyChoice, setVisibleLastCurrencyChoice] = useState(false);
    const { addExpense, updateExpense, delExpense } = useExpenses();

    useEffect(() => {
        if (expense) {
            setAmount(expense.amount.toString());
            setDate(new Date(expense.date));
            setTextInput(expense.name);
            setCategory(expense.category);
            setEmotionRate(expense.emotion);
            setCurrency(expense.currencyCode);
        }
    }, [expense]);


    function toggleCategoryDialog() {
        setVisibleCategoryDialog(!visibleCategoryDialog)
    }


    function DeleteExpense() {
        return <FAB
            containerStyle={{  }}
            title={'Delete'}
            titleStyle={{ color: 'white' }}
            size={'medium'}
            visible={true}
            color="orange"
            icon={{ name: 'delete', type: 'ionicons', color: 'white' }}
            onPress={() => {
                delExpense(expense.id);
                navigate('List_Expenses');
            }} />

    }

    function TotalExpense() {
        return <View style={{ flex: 0.6, borderRadius: 5, backgroundColor: theme.colors.grey5, margin: 5, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Button
                title={currency}
                raised={false}
                color={theme.colors.grey3}
                containerStyle={{
                    margin: 5,
                    flex: 1
                }}
                onPress={() => setVisibleLastCurrencyChoice(!visibleLastCurrencyChoice)}
            />


            <Text
                style={{ textAlign: 'right', margin: 10, fontSize: 33, flex: 3 }}
                onPress={visibleCategoryDialog ? () => { toggleCategoryDialog(); setCategory('') } : undefined}>
                {amount}</Text>
            <Button
                raised={false}
                color={'orange'}
                icon={{ name: 'backspace', type: 'ionicons' }}
                titleStyle={{ fontSize: 35, margin: 5 }}
                buttonStyle={{ borderRadius: 5 }}
                containerStyle={{ margin: 5, flex: 1 }}
                disabled={visibleCategoryDialog}
                onPress={() => {
                    if (amount === '0' || amount === '')
                        setAmount('0');
                    else {
                        if (amount.length > 1)
                            setAmount(amount.slice(0, -1));

                        else
                            setAmount('0');
                    }
                }} />
        </View>;
    }

    function DatePicker() {

        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

        const handleConfirm = (selectedDate) => {
            setDate(selectedDate);
        };
        const showDatePicker = () => {
            setDatePickerVisibility(true);
        };

        const hideDatePicker = () => {
            setDatePickerVisibility(false);
        };

        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Pressable onPress={showDatePicker}>
                    <Icon name={'calendar'} type={'antdesign'} />
                    <Text>{date.toLocaleDateString()}</Text>
                </Pressable>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        display="spinner"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        isDarkModeEnabled={theme.mode === 'dark'}
                        themeVariant={theme.mode === 'dark' ? 'dark' : 'light'}
                        date={date}
                    />
                </View>
            </View>
        );
    }



    return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
            {expense ? <DeleteExpense /> : <></>}
            <DatePicker />
            <EmotionSlider styles={{ flex: 1 }} emotionRate={emotionRate} setEmotionRate={setEmotionRate} minimumValue={-10} maximumValue={10} />
            <Input
                value={textInput}
                containerStyle={{ flex: 1 }}
                placeholder={'description'}
                onChangeText={(value) => setTextInput(value)}
                errorMessage={!textInput ? 'provide a descrption' : ''}
            />
            <TotalExpense />
            {visibleCategoryDialog ?
                <CategoryChoice categories={categories} setCategory={setCategory} />
                :
                <CalcDial amount={amount} setAmount={setAmount} />
            }
            <Button
                containerStyle={{}}
                title={category === '' ? 'Choose category' : expense ? `Update - ${category}` : `Add - ${category}`}
                onPress={category === ''
                    ? toggleCategoryDialog
                    :
                    () => {
                        const expenseData = {
                            category: category,
                            name: textInput,
                            date: date.toDateString(),
                            emotion: emotionRate,
                            amount: isIncome ? parseFloat(amount) : parseFloat(amount) * -1,
                            currencyCode: currency
                        };
                        if (expense) {
                            updateExpense({ id: expense.id, newExpense: expenseData });
                            console.log(expense.id)
                        } else {
                            addExpense(expenseData);
                        }
                        navigate('List_Expenses');
                    }}
                size={'lg'}
                radius={'md'}
                disabled={(amount === '0' || !textInput) ? true : false}
                color={'secondary'}
            />

            <DialogChoice
                visible={visibleLastCurrencyChoice}
                setVisible={setVisibleLastCurrencyChoice}
                title='Select currency for expenses'
                data={usedCurrencies}
                checkedId={usedCurrencies.findIndex((item) => item.code === lastCurrencyCode) + 1}
                submit={(code) => {
                    setLastCurrencyCode(code)
                    setCurrency(code);
                }}
            />

        </View>
    )






}