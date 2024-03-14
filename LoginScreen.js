import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Modal, Pressable } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import myColor from './Components/Color';
import app from './Components/firebase';


const UserIcon = () => {
  return (
    <View style={styles.userIconContainer}>
      <FontAwesome5 name="user" style={styles.userIcon} />
    </View>
  );
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoad(true);
    const auth = getAuth();
    const db = getFirestore(app);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userCollection = collection(db, 'users');
      const userDoc = doc(userCollection, userCredential.user.uid);
      const userSnapshot = await getDoc(userDoc);
  
      if (userSnapshot.exists()) {
        const user = userSnapshot.data();
        console.log('User:', user);
        const userData = {
          id: userCredential.user.uid,
          ...user
        };
         await AsyncStorage.setItem('user', JSON.stringify(userData));
     
        setLoad(false);
        navigation.navigate('main');
      } else {
        console.log('User document does not exist.');
        setLoad(false);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setLoad(false);
    }
  };


  const handleRegister = ()=>{
    navigation.navigate('Signup');
  }
  const handleforget = ()=>{
    console.log("hi");
  }

  return (
    <View style={styles.container}>
      <UserIcon />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <FontAwesome5 name="envelope" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { marginBottom: 5 }]}
            placeholder="Enter password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <FontAwesome5 name={passwordVisible ? 'eye-slash' : 'eye'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} >
          {load ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <View style={styles.google}>
          <TouchableOpacity>
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>
        </View>

        <Pressable
          style={{ marginTop:0}}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.forgotPasswordText}>Forget Password</Text>
        </Pressable>

        <TouchableOpacity onPress={handleRegister} style={{ marginTop: 16 }}>
          <Text style={styles.redirectText}>Register here</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={handleforget}>
                  <Text style={styles.textStyle}>Submit</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconContainer: {
    backgroundColor: '#5fa9c7',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5, marginTop:'10%',
  },
  userIcon: {
    fontSize: 60,
    color: 'white',
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: myColor.bgcolor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15, width:110,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPasswordText: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
    color: 'gray',
  },
  redirectText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22, 
  },
  modalView: {
    margin: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    padding: 30,
    height: 170,  // Updated height property
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 50,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  google: {
    width: '70%',
    height: 45,
    borderRadius: 30,
    backgroundColor: myColor.bgcolor,
    marginTop: 30, marginBottom:20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
