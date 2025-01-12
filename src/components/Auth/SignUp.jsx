import { Button, Form } from 'react-bulma-components'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { auth } from "../../services/config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/config/firebase'
import axios from 'axios'
const API = import.meta.env.VITE_API_URL;

// import { useAuth } from '../../contexts/AuthContexts'

console.log(API)
export default function SignUp() {

  
  
  const userCollectionRef = collection(db, "users");
  const navigate = useNavigate()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [client, setClient] = useState({
    registration_datetime: '2023-09-12T01:59:14.000Z',
    username: '',
    email: 'email@example.com',
    password: '',
    profile_picture: 'none',
    role: 'student',
  });



  const newClient = async () => { // Make it async
    try {
      await axios.post(`${API}/clients`, client); // Use client object directly
      // navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }
  // const [errorMessage, setErrorMessage] = useState('');


  //---------------------------------------
  const handleSignUp = async (e) => {
    e.preventDefault();
   
    try {
      // Treat the username as the email and create a user account in firebase Auth
      // await createUserWithEmailAndPassword(auth, `${username}@domain.com`, password)
      await createUserWithEmailAndPassword(auth, `${client.username}@domain.com`, client.password)
      // console.log(`Signup successful`);
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        const registrationDate = user.metadata.creationTime
        const dateObj = new Date(registrationDate)
        const registered = dateObj.toISOString();
        const userEmail = user.email
        // const recordDate = {...client, registration_datetime: registered}
      
        console.log(`new user created with UID: ${uid} Username: ${userEmail} registed on ${registered}`);
 
        console.log(client)
        
      });

      await newClient();
      //add the new user data to firestore db
      await addDoc(userCollectionRef, { username: username, password: password });
      //clear fields
      setUsername('');
      setPassword('')
      setConfirmPassword('')
      //redirect user
      navigate('/')

    } catch (error) {
      console.error('Signup error', error.message);
      // Look into prompt if error relates to username already in use
    }
  };
//-------------------------------------------------
//used for testing


//-----------------------

  const handleTextChange = (e) => {
    setClient({...client, [e.target.id]: e.target.value })
  }

  return (
    <form className='form' onSubmit={handleSignUp}>
      <Form.Control>
        <Form.Field>
          <Form.Input
            id='username'
            type='text'
            value={client.username}
            color="link"
            placeholder='Username'
            // onChange={(e) => setUsername(e.target.value)}
            onChange={handleTextChange}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            id='password'
            type='password'
            value={client.password}
            color="link"
            placeholder='Password'
            // onChange={(e) => setPassword(e.target.value)}
            onChange={handleTextChange}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            type='password'
            value={confirmPassword}
            color="link"
            placeholder='Confirm password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Button className='is-link'>Sign Up</Button>
        </Form.Field>
      </Form.Control>
    </form>
  )
}
