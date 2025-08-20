import React, { useState } from 'react';
import { View, ScrollView, Image, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
    Text,
    ListItem,
    Avatar,
    Icon,
    Badge,
    ListItemProps,
    Button,
    CheckBox,
    Switch,
    useTheme,
    FAB
} from '@rneui/themed';
import { useStyles } from '../../../styles'
import { useCategories } from '../hooks';
import { reduceArrayDuplicates } from '../../../utilities/helper';

const categoryData = require("../../../../assets/data/categories.json");

export default function AddCategory() {
    const styles = useStyles();
    const { navigate } = useNavigation();
    const { addCategories, categories } = useCategories();
    const [checked, setChecked] = useState([...Array(categoryData.length)].fill(false));
    const { theme } = useTheme();
    const redCategoryData = reduceArrayDuplicates(categoryData, categories);
    return (
        <View style={styles.container}>
            <ScrollView >
                {
                    redCategoryData
                    .map((l, i) => (
                        <View style={{ padding: 4 }} key={l + i}>
                            <ListItem
                                bottomDivider
                                linearGradientProps={{
                                    colors: [theme.colors.white, theme.colors.grey5],
                                    start: { x: 1, y: 0 },
                                    end: { x: 0.2, y: 0 },
                                }}
                                ViewComponent={LinearGradient}
                                leftWidth={80}
                                rightWidth={90}
                                minSlideWidth={40}
                                key={l + i}
                                onPress={() => setChecked(checked.map((item, index) => index === i ? item = !item : item = item))}
                            >
                                <Avatar
                                    size={32}
                                    rounded
                                    icon={{ name: l.avatar_icon, type: l.icon_type }}
                                    containerStyle={{ backgroundColor: l.avatar_background }}
                                />
                                <ListItem.Content>
                                    <ListItem.Title style={{ color: theme.colors.black, fontWeight: "bold" }}>
                                        {l.name}
                                    </ListItem.Title>
                                </ListItem.Content>
                                {checked[i] ? <ListItem.Chevron color={theme.colors.grey2} name={'check'} type={'font-awesome-5'} /> : <></>}
                            </ListItem>
                        </View>
                    ))
                }
            </ScrollView >
            <FAB
                visible={true}
                disabled={!checked.some((item) => item === true)}
                placement='right'
                onPress={() => {
                    addCategories(redCategoryData.filter((element, index) => checked[index]))
                    navigate('List_Categories')
                }}
                icon={{ name: 'add', color: theme.colors.white }}
                color={theme.colors.secondary}
            />

        </View>
    )
}

