import React from "react";
import { auth, db } from "../firebase";
import UserNavBar from "./UserNavBar";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { doc, getDoc, addDoc, collection, onSnapshot, getDocs, where } from "firebase/firestore";
import StarRating from "./StarRating";



const Contact = ()=>{

    const [connected, setConnected] = useState(false);
    const [providerData, setProviderData] = useState([]);
    const [userData, setUserData] = useState([]);
    const {id} = useParams();

    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    const handleClose = (event) => {
        const button_val = event.target.value;
        setShow(false);
        if(button_val == 'send'){
            alert('Sending message is not available right now..');
        }
        

    };
    const handleShow = () => setShow(true);

    const contactStyles = {
        marginBottom: '200px',
        marginTop: '40px',
        marginRight:'100px',
        marginLeft:'100px'
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user && user.emailVerified) {
            setConnected(true);
          } else {
            setConnected(false);
          }
        });
    
        return () => unsubscribe();
      }, []);


    useEffect(()=>{
        const fetchProviderData = async () => {
            try {
              const providerDocRef = doc(db, "providers", id);
              const docSnapshot = await getDoc(providerDocRef);
      
              if (docSnapshot.exists()) {
                const documentData = docSnapshot.data();
                setProviderData(documentData);
              } else {
                console.log("No document found");
              }
            } catch (error) {
              console.error("Error fetching provider data:", error);
            }
          };

          fetchProviderData();
          calculateAverageRating();
    },[id]);  


    const calculateAverageRating = async () => {
        try {
          const ratingsSnapshot = await getDocs(
            collection(db, "ratings"),
            where("providerId", "==", id)
          );
      
          if (!ratingsSnapshot.empty) {
            let totalRating = 0;
            let count = 0;
            const userIds = new Set();
      
            ratingsSnapshot.forEach((doc) => {
              const ratingData = doc.data();
              if (!userIds.has(ratingData.userId)) {
                totalRating += ratingData.rating;
                count++;
                userIds.add(ratingData.userId);
              }
            });
      
            const average = totalRating / count;
            setAverageRating(average);
          } else {
            setAverageRating(0);
          }
        } catch (error) {
          console.error("Error calculating average rating:", error);
        }
      };
      

    

    const fetchUserData = async ()=>{
        try {
            const userDocRef = doc(db,'users',auth.currentUser.uid);
            const docSnap = await getDoc(userDocRef);

            if(docSnap.exists()){
                const userDocData = docSnap.data();
                setUserData(userDocData);
                console.log(userData);
            } else {
                console.log('error finding the doc');
            }
        } catch(error){
            console.error('Error fetching user data:', error);
        }
        handleShow();
    }


    const handleMessage = ()=>{
        if(connected){
            fetchUserData();

        }
        else{
            alert('Only registred users can leave messages.');
            console.log(providerData);
        }
    }

    const handleRating = async (rate) => {
        if (connected) {
          try {
            const ratingData = {
              userId: auth.currentUser.uid,
              providerId: id, 
              rating: rate,
            };

            console.log(ratingData);
    
            await addDoc(collection(db, "ratings"), ratingData);
            setRating(rate); 
          } catch (error) {
            console.error("Error adding rating:", error);
          }
        }
      };

    return(
        <div>
            { connected ? (
            <div>
                <UserNavBar />
                <br />
            </div>
            ) : (
            <div>
                <NavBar />
                <br />
            </div>
            )}

            <Card style={contactStyles}>
                <Card.Body>
                    <Card.Title>
                        {providerData ? providerData.activity_name : 'Loading...'}
                        </Card.Title>
                    <Card.Subtitle>
                        {providerData ? providerData.first_name : 'Loading...'}  
                        {providerData ? providerData.last_name : 'Loading...'} 
                        </Card.Subtitle>
                    <Card.Text>
                        <br/>
                        {providerData ? providerData.phone : 'Loading...'} <br/>
                        {connected ? (
                            <span>{providerData ? providerData.email : 'Loading...'}</span>
                        ) : (
                            <span style={{color: 'red'}}>Only registred users can see the email of the provider</span>
                        )}
                    </Card.Text>
                    <Card.Body>
                        <StarRating 
                            rating={rating} 
                            onRating={handleRating}
                            connected={connected}
                            averageRating={averageRating}/>
                    </Card.Body>
                    
                    <Button variant="primary" onClick={handleMessage}>Leave a message</Button>
                </Card.Body>
                
            </Card>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>To {providerData.first_name} {providerData.last_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <textarea type='text' placeholder='Enter your message here' rows='8' cols='50'></textarea>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button value='close' variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button value='send' variant="primary" onClick={handleClose}>
                        Send
                    </Button>
                    </Modal.Footer>
                </Modal>
        </div>

    )
}

export default Contact