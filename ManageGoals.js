import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import app from './Components/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  doc, getDoc, getFirestore, collection, setDoc ,getDocs} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';



  
//         {/* Update and Delete Icons */}
//         <TouchableOpacity onPress={onUpdate}>
//           <FontAwesome name="pencil" size={24} color="black" style={styles.icon} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={onDelete}>
//           <FontAwesome name="trash" size={24} color="black" style={styles.icon} />
//         </TouchableOpacity>
//       </View>
//     );
//   };


const ManageGoals = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [allGoals, setAllGoals] = useState([]);
  const navigation = useNavigation();
  const db = getFirestore(app);
  let goals =[];
  const [newGoal, setNewGoal] = useState({
    goalName: '',
    description: '',
    totalAmount: '',
    dueDate: '',
  });

  const handleAddGoal = async () => {
    const user = await AsyncStorage.getItem('user');
const userID = JSON.parse(user).id
    const db = getFirestore(app);
    const usersCollection = collection(db, "users");
    const userDocRef = doc(usersCollection, userID);
    const goalsCollection = collection(userDocRef, "goals");
    const goalsDocRef = doc(goalsCollection );
    setDoc(goalsDocRef, {
        newGoal,
    });

    console.log('New Goal:', newGoal);
    setShowAddGoal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myuser1 = await AsyncStorage.getItem('user');
        const myuser = JSON.parse(myuser1);
  
        // Get user document from Firestore
        const userCollection = collection(db, 'users');
        const userDoc = doc(userCollection, myuser.id);
        
        // Get goals collection from user document
        const goalsRef = collection(userDoc, 'goals');
        
        // Fetch documents from goals collection
        const goalsSnapshot = await getDocs(goalsRef);
        
        console.log("Data fetched successfully");
        
        // Store goals data in an array
        const goalsData = goalsSnapshot.docs.map(doc => {
          const goalData = doc.data();
         
          goals.push({id: doc.id,
            goalName: goalData.newGoal.goalName,
            goalDescription: goalData.newGoal.description,
            totalAmount: goalData.newGoal.totalAmount,
            dueDate: goalData.newGoal.dueDate || null,})
            
          
        });
  
        setAllGoals(goals);
        // Do whatever you need with goalsData here
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);


  return (
    <ScrollView style={styles.container}>
      <View style={styles.allGoals}>
        <Text style={styles.heading}>All Goals</Text>
      <TouchableOpacity style={styles.addGoalButton} onPress={() => setShowAddGoal(true)}>
        <Text style={styles.buttonText}>Add Goal</Text>
      </TouchableOpacity>
      </View>

      {/* Existing Goals Section */}
      <ScrollView style={styles.goalsContainer}>
        {/* Existing Goal Box (Repeat this for each existing goal) */}
        {/* <View style={styles.goalBox}>
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Goal Name:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>Existing Goal</Text>
            </View>
          </View>
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Description:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>some description</Text>
            </View>
          </View>
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Total Amount:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>1000</Text>
            </View>
          </View>
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Due Date:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>31-Dec-2022</Text>
            </View>
          </View>
        </View> */}
        {/* <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <TouchableOpacity>
          <FontAwesome name="pencil" size={32} color="brown" style={{marginLeft:'81%', marginTop:10}} />
         </TouchableOpacity>
         <TouchableOpacity>
           <FontAwesome name="trash" size={32} color="brown" style={{marginRight:10, marginTop:10}} />
         </TouchableOpacity>
         </View> */}
        
        {/* Add Goal Form (Conditional Rendering) */}
        {showAddGoal && (
            
          <View style={styles.goalBox}>
            <View style={styles.goalDetailContainer}>
              <Text style={styles.goalDetailLabel}>Goal Name:</Text>
              <View style={styles.textbox}>
                <Text style={styles.goalDetailValue}>{newGoal.goalName}</Text>
              </View>
            </View>
            <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Description:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>{newGoal.description}</Text>
            </View>
          </View>
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Total Amount:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>{newGoal.totalAmount}</Text>
            </View>
          </View>
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Due Date:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>{newGoal.dueDate || 'No Due Date'}</Text>
            </View>
          </View>

          </View>

        )}
      </ScrollView>

      {/* Add Goal Section */}
      

      {/* Add Goal Form (Conditional Rendering) */}
      {showAddGoal && (
        <View style={styles.addGoalForm}>
          <TextInput
            style={styles.input}
            placeholder="Goal Name"
            onChangeText={(text) => setNewGoal({ ...newGoal, goalName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Total Amount"
            onChangeText={(text) => setNewGoal({ ...newGoal, totalAmount: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Due Date (Optional)"
            onChangeText={(text) => setNewGoal({ ...newGoal, dueDate: text })}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

{allGoals.length>0 ? (
       allGoals.map((goal)=>( <View style={styles.currentGoalContainer} key={goal.id}>
        {/* <Text style={styles.currentGoalText}>Current Goal</Text> */}
        <View style={styles.goalBox}>
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Goal Name:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>{goal.goalName}</Text>
            </View>
          </View>
          
            <View style={styles.goalDetailContainer}>
              <Text style={styles.goalDetailLabel}>Description:</Text>
              <View style={styles.textbox}>
                <Text style={styles.goalDetailValue}>{goal.goalDescription}</Text>
              </View>
            </View>
          
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Total Amount:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>${goal.totalAmount}</Text>
            </View>
          </View>
          <View style={styles.goalDetailContainer}>
            <Text style={styles.goalDetailLabel}>Due Date:</Text>
            <View style={styles.textbox}>
              <Text style={styles.goalDetailValue}>{goal.dueDate || 'No Due Date'}</Text>
            </View>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <TouchableOpacity>
          <FontAwesome name="pencil" size={32} color="brown" style={{marginLeft:'81%', marginTop:10}} />
         </TouchableOpacity>
         <TouchableOpacity>
           <FontAwesome name="trash" size={32} color="brown" style={{marginRight:10, marginTop:10}} />
         </TouchableOpacity>
         </View>
        </View>
      </View>))
      ):(<Text style={{textAlign:"center", marginTop:20}}>WE ARE LOADING YOUR GOALS.</Text> )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10, 
    textAlign: 'center',
  },
  goalsContainer: {
    marginBottom: 20,
  },
  goalBox: {
    backgroundColor: 'lightgrey',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  goalBoxText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  goalDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  addGoalButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  goalDetailLabel: {
    fontSize: 16,
    marginRight: 5, width: 100,
  },
  addGoalForm: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textbox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 9,
    flex: 1,
  },
  goalDetailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  allGoals:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
});

export default ManageGoals;
