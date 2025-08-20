import React, { useState } from 'react';
import Modal from 'react-native';
import { View, ScrollView, StyleSheet, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
    Text,
    ListItem,
    Avatar,
    Button,
    Dialog,
    useTheme,
    Input,
    FAB
} from '@rneui/themed';
import { useStyles } from '../../../styles'
import { useCategories } from '../hooks';



export default function ListCategories() {
    const styles = useStyles();
    const { theme } = useTheme();
    const { navigate } = useNavigation();
    const { categories, removeCategory, updateCategoryName } = useCategories();
    const [isVisibleDialog, setVisibleDialog] = useState(false);
    const [categoryDialog, setCategoryDialog] = useState('');
    const [textDialog, onChangeTextDialog] = useState('');
    return (
        <View style={styles.container}>
            <ScrollView >
                {categories ?
                    categories.map((l, i) => (
                        <View style={{ padding: 4 }} key={l + i}>
                            <ListItem.Swipeable
                                onPress={() => {
                                    setCategoryDialog(l);
                                    onChangeTextDialog(l.name)
                                    setVisibleDialog(true);
                                }}
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
                                key={i}
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
                                        onPress={() => removeCategory(l)}
                                    />
                                )}
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
                                <ListItem.Chevron name='angle-left' type='font-awesome-5' />
                            </ListItem.Swipeable>
                        </View>
                    ))
                    : <Text color={theme.colors.white}>So far no categories</Text>
                }
            </ScrollView>
            <FAB
                visible={true}
                placement="right"
                onPress={() => navigate('Add_Category')}
                icon={{ name: 'add', color: theme.colors.white }}
                color={theme.colors.secondary}
            />
            <Dialog
                isVisible={isVisibleDialog}
                onBackdropPress={() => setVisibleDialog(false)}
            >
                <Dialog.Title
                    title="Change name" 
                    titleStyle={{color: theme.colors.black}}
                />
                <Input
                    name={'Name'}
                    onChangeText={onChangeTextDialog}
                >{categoryDialog.name}</Input>
                <Dialog.Button title='OK' onPress={() => updateCategoryName({ category: categoryDialog, newName: textDialog })} disabled={(categoryDialog.name === textDialog) ? true : false} />
                <Dialog.Button title='Abbruch' onPress={() => setVisibleDialog(false)} />
            </Dialog>
        </View>
    )
}

