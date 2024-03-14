import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
    const navigation = useNavigation();
    const [showGenerateOptions, setShowGenerateOptions] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleProfile = () => {
        navigation.navigate('profile');
    }

    const handleGenerateOptionsToggle = () => {
        setShowGenerateOptions(!showGenerateOptions);
    }

    const handleNotifications = () =>{
        setShowNotifications(!showNotifications);
    }

    const handleLogout = ()=>{
        AsyncStorage.removeItem('user');
        navigation.navigate("screen1")
      }

      const handleAchievements = () =>{
        navigation.navigate('Achievements');
      }

      const handlePolicy = ()=>{
        navigation.navigate('policy');
      }

      const handleGeneral = ()=>{
        navigation.navigate('general');
      }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {/* <Text style={styles.headerText}>Settings</Text> */}
                <MaterialIcons name="settings" style={styles.headerIcon} />
            </View>
            <TouchableOpacity style={styles.row} onPress={handleProfile}>
                <Text style={styles.link}>My Profile</Text>
                <FontAwesome5 name="user-circle" style={[styles.rowIcon, { color: '#FFA500' }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={handleNotifications}>
                <Text style={styles.link}>Notification Preferences</Text>
                <MaterialIcons name={showNotifications ? "keyboard-arrow-up" : "chevron-right"} style={[styles.rowIcon, { color: 'black' }]} />
            </TouchableOpacity>
            {showNotifications && (
                <View style={styles.dropdown}>
                    <TouchableOpacity style={styles.dropdownOption}>
                        <Text>Goal progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownOption}>
                        <Text>Achieving goal</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={styles.row} onPress={handleGenerateOptionsToggle}>
                <Text style={styles.link}>Generate Reports</Text>
                <MaterialIcons name={showGenerateOptions ? "keyboard-arrow-up" : "chevron-right"} style={[styles.rowIcon, { color: 'black' }]} />
            </TouchableOpacity>
            {showGenerateOptions && (
                <View style={styles.dropdown}>
                    <TouchableOpacity style={styles.dropdownOption}>
                        <Text>Generate Financial Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownOption}>
                        <Text>Generate Expense Report</Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity style={styles.row} onPress={handleGeneral}>
                <Text style={styles.link}>General settings</Text>
                <FontAwesome name="globe" style={[styles.rowIcon, { color: '#3498DB' }]} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.row}>
                <Text style={styles.link}>Currency</Text>
                <FontAwesome name="money" style={[styles.rowIcon, { color: '#F1C40F' }]} />
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.row} onPress={handleAchievements}>
                <Text style={styles.link}>Achievements</Text>
                <FontAwesome name="trophy" style={[styles.rowIcon, { color: '#FFD700' }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
                <Text style={styles.link}>Help and FAQs</Text>
                <MaterialIcons name="description" style={[styles.rowIcon, { color: '#607D8B' }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={handlePolicy}>
                <Text style={styles.link}>Privacy Policy</Text>
                <FontAwesome5 name="user-secret" style={[styles.rowIcon, { color: '#8E44AD' }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
                <MaterialIcons name="logout" style={[styles.logoutIcon, { color: '#ffffff' }]} />
            </TouchableOpacity>
            {/* <Button icon="logout" mode="contained" style={styles.logoutButton} onPress={handleLogout}>
      Logout
    </Button> */}
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center', justifyContent:'center',
        marginBottom: 15,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
    },
    headerIcon: {
        fontSize: 65,
        color: '#666666',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 15,
    },
    link: {
        fontSize: 16,
        color: '#333333',
    },
    rowIcon: {
        fontSize: 22,
        color: '#666666',
    },
    dropdown: {
        backgroundColor: '#f9f9f9',
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
    },
    dropdownOption: {
        paddingVertical: 5,
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: 'blue',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 70,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutIcon: {
        fontSize: 20,
        color: '#ffffff',
    },
});

export default Settings;
