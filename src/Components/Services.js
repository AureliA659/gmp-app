import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import NavBar from "./NavBar";
import UserNavBar from "./UserNavBar";
import  Carousel  from "react-bootstrap/Carousel";
import Agriculture from '../assets/dan-meyers-unsplash.jpg';
import Crafts from '../assets/anne-nygard-unsplash.jpg';
import Informatics from '../assets/clement-helardot-unsplash.jpg';
import Educ from '../assets/element5-digital-unsplash.jpg';
import Health from '../assets/nci-unsplash.jpg';
import Domestic from '../assets/hayley-clues-unsplash.jpg';
import Transport from '../assets/zetong-li-unsplash.jpg';
import Crea from '../assets/my-life-through-a-lens-unsplash.jpg';
import Support from '../assets/petr-machacek-unsplash.jpg';

import ListServices from "./ListServices";



function Services(){

    const [connected, setConnected] = useState(false);

    useEffect(() => {
            const user = auth.currentUser;
            if (user && user.emailVerified) {
                setConnected(true);
            } else {
                setConnected(false);
            }
        
    },[]);

    const carouselStyles = {
        width: '550px',
        height: '300px',
        marginTop: '20px',
        marginBottom: '100px'
      };
    const titleStyle = {
        textShadow: '3px 3px 6px black',
    };

    const [isClicked, setIsClicked] = useState(false);
    const [selectedCat, setSelectedCat] = useState('');
    
    const handleClick = async (value) => {
        setIsClicked(true);
        // const selectedCat = value;
        // const q = query(
        //   collection(db, "providers"),
        //   where("activity_category", "==", selectedCat)
        // );
        // const querySnapshot = await getDocs(q);
        // const documents = [];
        // querySnapshot.forEach((doc) => {
        //   const documentData = doc.data();
        //   documents.push(documentData);
        // });
        // console.log(documents);
        // setResults(documents);
        setSelectedCat(value);
      };

    return(
        <div>
            {connected ? (
                <div>
                    <UserNavBar/><br/>
                </div>
            ) : (
                <div>
                    <NavBar/><br/>
                </div>
            )

            }
            <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
            
            <Carousel style={carouselStyles}>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Agriculture}
                    alt="by Dan Meyers on Unsplash"
                    />
                    <Carousel.Caption
                        onClick={()=>handleClick('Agriculture')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                    
                        <h3 style={titleStyle}>Agriculture Services</h3>
                    
                    </Carousel.Caption>
                </Carousel.Item>
                
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Domestic}
                    alt="by Hayley Clues on Unsplash"
                    />
                    <Carousel.Caption
                        onClick={()=>handleClick('Domestic Services')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                        <h3 style={titleStyle}>Domestic Services</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Crafts}
                    alt="by Anne Nygard on Unsplash"
                    />
                    <Carousel.Caption
                        onClick={()=>handleClick('Crafts')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                        <h3 style={titleStyle}>Crafts</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Informatics}
                    alt="by Clement Helardot on Unsplash"
                    />
                    <Carousel.Caption
                        onClick={()=>handleClick('Informatic Technology')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                        <h3 style={titleStyle}>Informatics Services</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Educ}
                    alt="by Digital5 on Unsplash"
                    />
                    <Carousel.Caption
                        onClick={()=>handleClick('Education')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                    <h3 style={titleStyle}>Education</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Health}
                    alt="nci"
                    />
                    <Carousel.Caption
                        onClick={()=>handleClick('Health Care')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                    <h3 style={titleStyle}>Health Services</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Crea}
                    alt='by My life through a lens unsplash'
                    />
                    <Carousel.Caption
                        onClick={()=>handleClick('Creative Services')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                        <h3 style={titleStyle}>Creative Services</h3>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Support}
                    alt='by Unsplash'
                    />
                <Carousel.Caption
                        onClick={()=>handleClick('Support Services')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                    <h3 style={titleStyle}>Support Services</h3>
                </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={Transport}
                    alt="by Zetong Li on Unsplash"
                    />
                    <Carousel.Caption
                        onClick={()=>handleClick('Transport')} 
                        className={isClicked ? "underline" : ""} 
                        style={{cursor:"pointer"}}>
                    <h3 style={titleStyle}>Transport Services</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            {isClicked && (
            // <div style={{marginTop: '100px'}}>
            //     {results.length === 0 ? (
            //         <span>There are no providers for this category right now..</span>
            //     ) : (
                    <div>
                        <ListServices result = {selectedCat}/>
                    {/* <Accordion>
                        {results.map((result,index) => (
                            <Accordion.Item eventKey={index.toString()}>
                                <Accordion.Header>{result.activity_name} {result.country}</Accordion.Header>
                                <Accordion.Body>test</Accordion.Body>
                            </Accordion.Item>
                        ))}
                        </Accordion> */}
                        </div>
            //     )}
            // </div>
            )}

            
            
            
            </div>
           
        </div>
    );
    }

export default Services