import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
    Button,
    Text,
    ListItem,
    Avatar,
    useTheme
} from '@rneui/themed';
import { useStyles } from '../../../styles';
import { useCurrencies } from '../../currencies/hooks';
import { useCategories } from '../../categories/hooks';
import { useExpenses } from '../hooks';
import { useNavigation } from "@react-navigation/native"

const emotions = require('../../../../assets/data/emotions.json');

//                                 icon={{ name: , type: categories.filter(item => item.name === element.category)[0]?.icon_type }}

function ListAccordion({ array, type, updateHandler }) {
    const [expanded, setExpanded] = useState(false);
    const { theme } = useTheme();
    const { defaultCurrencyCode, getExchangeRate } = useCurrencies();
    const { delExpense } = useExpenses();
    const { navigate } = useNavigation();
    const { categories } = useCategories();

    const config = {
        date: {
            groupIcon: 'calendar',
            groupIconFamily: 'font-awesome',
            groupTitle: (array) => array.date,
            showElementIcon: true,
            elementIcon: (element) => emotions.filter(item => item.emotion === element.emotion)[0]?.avatar_icon || 'category',
            elementIconFamily: (element) => emotions.filter(item => item.emotion === element.emotion)[0]?.icon_type || 'material',
            elementIconColor: (element) => emotions.filter(item => item.emotion === element.emotion)[0]?.avatar_background,
            showElementIconText: true,
            elementIconText: (element) => element.emotion.toString(),
            elementTitle: (element) => element.name,
            elementSubtitle: (element) => element.category,
        },
        category: {
            groupIcon: (array) => array.avatar_icon || 'category',
            groupIconFamily: (array) => array.icon_type || 'material',
            groupTitle: (array) => array.category,
            showElementIcon: true,
            elementIcon: (element) => emotions.filter(item => item.emotion === element.emotion)[0]?.avatar_icon || 'category',
            elementIconFamily: (element) => emotions.filter(item => item.emotion === element.emotion)[0]?.icon_type || 'material',
            elementIconColor: (element) => emotions.filter(item => item.emotion === element.emotion)[0]?.avatar_background,
            showElementIconText: true,
            elementIconText: (element) => element.emotion.toString(),
            elementTitle: (element) => element.name,
            elementSubtitle: (element) => element.date,
        },
        emotion: {
            groupIcon: (array) => array.avatar_icon || 'emoji-people',
            groupIconFamily: (array) => array.icon_type || 'material',
            groupTitle: (array) => array.name,
            showElementIcon: true,
            elementIcon: (element) => categories.filter(item => item.name === element.category)[0]?.avatar_icon || 'category',
            elementIconFamily: (element) => categories.filter(item => item.name === element.category)[0]?.icon_type || 'material',
            elementIconColor: (element) => categories.filter(item => item.name === element.category)[0]?.avatar_background,
            showElementIconText: false,
            elementIconText: (element) => {},
            elementTitle: (element) => element.name,
            elementSubtitle: (element) => element.category,

        }
    };

    const getConfig = (type, array) => ({
        groupIcon: typeof config[type].groupIcon === 'function' ? config[type].groupIcon(array) : config[type].groupIcon,
        groupIconFamily: typeof config[type].groupIconFamily === 'function' ? config[type].groupIconFamily(array) : config[type].groupIconFamily,
        groupTitle: config[type].groupTitle(array),
        showElementIcon: config[type].showElementIcon,
        elementIcon: config[type].elementIcon,
        elementIconFamily: config[type].elementIconFamily,
        elementIconColor: config[type].elementIconColor,
        showElementIconText: config[type].showElementIconText,
        elementIconText: config[type].elementIconText,
        elementTitle: config[type].elementTitle,
        elementSubtitle: config[type].elementSubtitle,
        
    });

    const { groupIcon, groupIconFamily, groupTitle, showElementIcon, elementIcon, elementIconFamily, elementIconColor, showElementIconText, elementIconText, elementTitle, elementSubtitle } = getConfig(type, array);

    return (
        <>
            <ListItem.Accordion
                content={
                    <>
                        <Avatar
                            size={25}
                            rounded
                            icon={{
                                name: groupIcon,
                                type: groupIconFamily,
                            }}
                            containerStyle={{ backgroundColor: array?.avatar_background || theme.colors.grey3, marginRight: 5 }}
                        />

                        <ListItem.Content>
                            <ListItem.Title style={{ fontWeight: "bold" }}>{groupTitle}</ListItem.Title>
                        </ListItem.Content>
                        <Text style={array.totalAmount > 0 ? { color: 'lightgreen' } : { color: 'orange' }}>{array.totalAmount.toFixed(2)} {defaultCurrencyCode}</Text>
                    </>
                }
                isExpanded={expanded}
                animation={'true'}
                onPress={() => {
                    setExpanded(!expanded);
                }}
            >
                {array.data.map((element, index) => (
                    <ListItem.Swipeable
                        topDivider
                        onPress={() => {
                            navigate('Update_Expenses', { expense: element });
                        } }
                        bottomDivider
                        key={`${index}_${element.name}_${element.amount}_${array.date || array.name || array.category}`}
                    >
                        {showElementIcon && (
                            <View>
                                <Avatar
                                    size={25}
                                    rounded
                                    icon={{
                                        name: elementIcon(element),
                                        type: elementIconFamily(element)
                                    }}
                                    containerStyle={{ backgroundColor: elementIconColor(element) }}
                                />
                                {showElementIconText && <Text>{elementIconText(element)}</Text>}
                            </View>

                        )}
                        
                        <ListItem.Content>
                            <ListItem.Title>{elementTitle(element)}</ListItem.Title>
                            <ListItem.Subtitle>{elementSubtitle(element)}</ListItem.Subtitle>
                        </ListItem.Content>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={element.amount > 0 ? { color: 'lightgreen' } : { color: 'orange' }}>{element.amount.toFixed(2)} {element.currencyCode}</Text>
                            {element.currencyCode !== defaultCurrencyCode
                                ?
                                getExchangeRate(element.currencyCode, defaultCurrencyCode) === 0 ? <Text style={{ color: 'red' }}> Please add currency with corresponding exchange rate </Text> :
                                    <Text style={{ color: 'orange' }}>( {(element.amount * getExchangeRate(element.currencyCode, defaultCurrencyCode)).toFixed(2)} {defaultCurrencyCode})</Text>
                                :
                                <></>}
                        </View>
                    </ListItem.Swipeable>
                ))}
            </ListItem.Accordion>
        </>
    );
}

export default function ListContainer({ data, type }) {
    const styles = useStyles();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
            {data.map((element, index) => <ListAccordion
                key={`${index}_${element.category || element.name || element.date}_${element.totalAmount}`}
                array={element}
                type={type}
            />)}
        </ScrollView>
    );
}
