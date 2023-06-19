import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';


const Footer = () => {

  const email = 'devthespot@gmail.com';

  const handleMail = ()=>{
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  }

  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col className='text-center'>
            <p style={{marginTop:'10px',marginBottom:'0'}}>&copy; 2023 The Spot. All Rights Reserved </p>
            <a style={{margin:'0'}} href={`mailto:${email}`} onClick={handleMail}>{email}</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
