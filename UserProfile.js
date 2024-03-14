import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { FontAwesome5 } from "@expo/vector-icons";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore, doc, updateDoc, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
// import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { ActionSheet } from "@expo/react-native-action-sheet";
import firebase from "@firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./Components/firebase";
import * as ImagePicker from "expo-image-picker";
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showUploadButton, setShowUploadButton] = useState(false);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let storedUserData = await AsyncStorage.getItem("user");
        storedUserData = JSON.parse(storedUserData);
        console.log("user data: ", storedUserData);
        if (storedUserData) {
          // const userData = JSON.parse(storedUserData);
          setUserData(storedUserData);
          setEmail(storedUserData.email);
          setPassword(storedUserData.password);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleManageProfile = () => {
    setIsEditMode(!isEditMode);
    setShowUploadButton(!isEditMode);
  };

  // const handleSaveProfile = async () => {
  //   try {
  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (user) {
  //       // Ask for current password
  //       const currentPass = window.prompt('Please enter current password');
  //       const emailCred = EmailAuthProvider.credential(user.email, currentPass);

  //       // Reauthenticate user
  //       await reauthenticateWithCredential(user, emailCred); // Use reauthenticateWithCredential

  //       // Update password if it is not empty
  //       if (password !== '') {
  //         // Update password in Firebase Authentication
  //         await updatePassword(user, password);

  //         // Update password in Firestore
  //         const db = getFirestore(app);
  //         const userDoc = doc(db, 'users', user.uid);
  //         await updateDoc(userDoc, { password: password }); // Update as per your Firestore schema

  //         // Update password in AsyncStorage
  //         const storedUserData = await AsyncStorage.getItem('user');
  //         const userData = JSON.parse(storedUserData);
  //         const updatedUserData = { ...userData, password };
  //         await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
  //       }

  //       setIsEditMode(false);
  //       console.log('Password updated successfully.');
  //       // Alert.alert('Profile Updated Successfully');
  //     }
  //   } catch (error) {
  //     console.error('Error updating password:', error.message);
  //     // Alert.alert('Error', error.message);
  //   }
  // };

  const handleLogout = () => {
    AsyncStorage.removeItem("user");
    navigation.navigate("screen1");
    // console.log("hi");
  };

  const handleSaveProfile = async () => {
    const storage = getStorage(app);
    const db = getFirestore(app);
    const timestamp = new Date().getTime();
    const fileExtension = selectedImage.split(".").pop().toLowerCase();
    const fileName = `userProfiles_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `userProfiles/${fileName}`);
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    const userDocRef = doc(collection(db, "users"), userData.id);

    updateDoc(userDocRef, {
      profile_url: downloadURL,
    });
    const updated_local_storage = { ...userData, profile_url: downloadURL };
    const updated_userData = JSON.stringify(updated_local_storage);
    localStorage.setItem("user", updated_userData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profileHeading}>User Profile</Text>
      <View style={styles.header}>
        <View style={styles.userImageOutline}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.userImage} />
          ) : userData?.profile_url ? (
            <Image source={userData.profile_url} style={styles.userImage} />
          ) : (
            <FontAwesome5 name="user" size={80} color="black" />
          )}
        </View>
        {isEditMode && showUploadButton && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImagePicker}
          >
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            editable={isEditMode}
          />
          <MaterialIcons
            name="email"
            size={24}
            color="black"
            style={styles.icon}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isEditMode}
            editable={isEditMode}
          />
          <MaterialIcons
            name="lock"
            size={24}
            color="black"
            style={styles.icon}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.manageProfileButton}
        onPress={isEditMode ? handleSaveProfile : handleManageProfile}
      >
        <Text style={styles.manageProfileButtonText}>
          {isEditMode ? "Save Profile" : "Manage Profile"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
        <MaterialIcons
          name="logout"
          style={[styles.logoutIcon, { color: "#ffffff" }]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  userImageOutline: {
    width: 120,
    height: 120,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 12,
  },
  userImage: {
    width: 98,
    height: 98,
    borderRadius: 49,
  },
  uploadButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
  },
  profileInfo: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  icon: {
    marginRight: 10,
  },
  logoutIcon: {
    fontSize: 20,
    color: "#ffffff",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  manageProfileButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  manageProfileButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfile;
