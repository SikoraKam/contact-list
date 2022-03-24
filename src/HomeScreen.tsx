import React, {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import axios from "axios";
import {Avatar, Checkbox, Searchbar, useTheme} from "react-native-paper";

const API_URL = 'https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json'

interface IContactPayload {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    gender: string
    avatar: string,
}

export const HomeScreen: React.FC = () => {

    const [contacts, setContacts] = useState<IContactPayload[]>([])
    const [filteredContacts, setFilteredContacts] = useState<IContactPayload[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [checkedContactsId, setCheckedContactsId] = useState<number[]>([])

    const theme = useTheme();

    useEffect(() => {
        (async () => await getContacts())()
    }, [])

    useEffect(() => {

        const filtered = contacts.filter(element => {
            const nameAndLastname = `${element.first_name} ${element.last_name}`
            return nameAndLastname.includes(searchQuery);
        })
        setFilteredContacts(filtered)
    }, [searchQuery])

    const getContacts = async () => {
        try {
            const response = await axios.get<IContactPayload[]>(API_URL);

            const sorted = response.data.sort((a,b) => a.last_name.localeCompare(b.last_name))
            setContacts(sorted)
            setFilteredContacts(sorted)
        }catch (e) {
            console.warn(e)
        }
    }

    const getInitials = (userData: IContactPayload) => {
        return `${userData.first_name[0]}${userData.last_name[0]}`;
    };

    const toggleCheck = (id: number) => {
        if (checkedContactsId.includes(id)) {
            const newArray = checkedContactsId.filter(element => element != id);
            console.log(newArray)
            setCheckedContactsId(newArray);
        } else {
            const newArray = [...checkedContactsId, id]
            console.log(newArray);
            setCheckedContactsId(newArray);
        }
    }

    const renderItem = ({item, index} : {item: IContactPayload, index: number}) => (
        <TouchableOpacity onPress={() => toggleCheck(item.id)}>
        <View style={styles.row}>
            <Avatar.Text size={32} label={getInitials(item)} style={{backgroundColor: index % 2 ? theme.colors.primary : theme.colors.accent}} />

            <Text>{`${item.first_name} ${item.last_name}`}</Text>

            <Checkbox.Item status={checkedContactsId.includes(item.id) ? 'checked' : 'unchecked'} label={""} onPress={() => toggleCheck(item.id)} />

        </View>
        </TouchableOpacity>
    )

    return <SafeAreaView style={styles.container}>

        <Searchbar autoComplete style={{marginBottom: 16}} placeholder="Search..." onChangeText={setSearchQuery} value={searchQuery} />
        <FlatList ListEmptyComponent={<ActivityIndicator animating={true} /> } data={searchQuery.length ? filteredContacts : contacts} renderItem={renderItem} />
    </SafeAreaView>
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginHorizontal: 16,
        paddingTop: 50,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})