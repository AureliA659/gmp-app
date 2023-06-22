import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ListGroup from "react-bootstrap/ListGroup";
import Card from 'react-bootstrap/Card';



const ListServices = (props)=>{

    const [results, setResults] = useState([]);
    const cat = props.result;


    useEffect(()=>{
        const selectedCat = cat;
        const q = query(
          collection(db, "providers"),
          where("activity_category", "==", selectedCat)
        );
        const fetchResults = async () => {
            const querySnapshot = await getDocs(q);
            const documents = [];
            querySnapshot.forEach((doc) => {
              const documentData = doc.data();
              documents.push(documentData);
            });
            console.log(documents);
            setResults(documents);
        };

        fetchResults();
    }, [cat]);

    return(
       <div style={{marginTop: '50px', marginBottom:'50px'}}>
                {results.length === 0 ? (
                    <span>There are no providers for this category right now..</span>
                ) : (
             <ListGroup as='ul' style={{width:'600px'}}>
                {results.map((result,index) => (
                    <ListGroup.Item as='li' eventKey={index.toString()} key={index}>
                        <Card>
                            <Card.Header>{result.activity_name}</Card.Header>
                            <Card.Body>
                                <Card.Title>{result.first_name} {result.last_name}</Card.Title>
                                <Card.Text>{result.phone} {result.email}</Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
                </ListGroup> 
        )}
    </div>
    )


}

export default ListServices