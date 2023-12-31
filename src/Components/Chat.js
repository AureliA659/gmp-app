import React, { useState, useEffect } from "react";
import { useAuthValue } from "./RegisterC/AuthContext";
import { getDoc, doc, collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserNavBar from "./UserNavBar";

function Chat() {

    const { currentUser} = useAuthValue();
    const [ userRef, setUserRef] = useState();
    const [searches, setSearches] = useState([]);


    useEffect(() => {
        const fetchUser = async () => {
          const promises = [
            getDoc(doc(db, 'users', currentUser.uid)),
            getDoc(doc(db, 'providers', currentUser.uid)),
          ];
    
          const results = await Promise.all(promises);
          const userData = results.find((result) => result.exists());
          setUserRef(userData?.data());
    
          fetchSearches();
        };
        fetchUser();
      }, [currentUser.uid]);

      const fetchSearches = async () => {
        const searchesRef = collection(db, 'users', currentUser.uid, 'history');
        const q = query(searchesRef);
        const querySnapshot = await getDocs(q);
        const searchesData = querySnapshot.docs.map((doc) => doc.data());
        setSearches(searchesData);
      };


    return (
        <>

            <div className="header-chat">
                <UserNavBar/>
            </div>

            <h1>Hi {`${userRef}`}</h1>
        
        
        
        
        
        </>
    )



}


export default Chat;