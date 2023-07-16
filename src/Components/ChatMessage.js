import React from "react";
import { useState, useEffect } from "react";
import { useAuthValue } from "./RegisterC/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Row, Col } from "react-bootstrap";


function ChatMessage(){
    const { currentUser } = useAuthValue();
    const [userRef, setUserRef] = useState();

    useEffect(() => {
        const fetchUser = async () => {
          if (currentUser) {
            const promises = [
              getDoc(doc(db, "users", currentUser.uid)),
              getDoc(doc(db, "providers", currentUser.uid))
            ];
    
            const results = await Promise.all(promises);
            const userData = results.find((result) => result.exists());
            setUserRef(userData?.data());
          }
        };
    
        fetchUser();
      }, [currentUser?.uid]);

  return (
    <div>
    <Row>
        {/* <Col>{userRef.pseudo}</Col> */}
        <Col></Col>
        

    </Row>
     </div>
  );


}
export default ChatMessage