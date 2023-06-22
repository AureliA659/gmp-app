import React, { Component } from 'react';
import NavBar from "./NavBar";
import UserNavBar from "./UserNavBar";
import SearchBar from "./SearchBar";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import './css/HPage_style.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';



class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      userData: null,
      searchResults: [],
      isClicked: false,
      selectedContact: null
    };
  }


  componentDidMount() {
    const user = auth.currentUser;
    if (user && user.emailVerified) {
      this.setState({ connected: true }, this.fetchUserData);
    } else {
      this.setState({ connected: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.connected !== this.state.connected) {
      if (!auth.currentUser) {
        this.setState({ connected: false });
      }
    }
  }

  fetchUserData = async () => {
    const user = auth.currentUser;
    const userRef = doc(db, 'users', user.uid);
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      this.setState({ userData: docSnapshot.data() });
      console.log(this.state.userData+' inhp');
    }
    
  };

  handleTitle = (contactData)=>{
    this.setState({selectedContact: contactData});
    this.props.history.push('/services/contact');
    
  }


  handleSearch = async (searchTerm) =>{
    this.setState({isClicked: true});
    const q = query(
      collection(db,'providers'),
      where('activity_name','>=', searchTerm.toUpperCase()),
      where('activity_name', '<=', searchTerm.toUpperCase())  
    );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc)=>{
      const docData = doc.data();
      documents.push(docData)
    });
    console.log(documents);
    this.setState({searchResults: documents});
  }

  
  render() {
    const { connected, searchResults, isClicked } = this.state;

    return (
      <div className="homepage">
        {connected ? (
          <div>
            <UserNavBar onSearch={this.handleSignOut}/>
            <br />
          </div>
        ) : (
          <div>
            <NavBar />
            <br />
          </div>
        )}

          <Row className='search_row'>
          <h1 className='h1_hp'>Find the service you need near you</h1>
          <div className='search-bar'>
            <br />
            <SearchBar onSearch={this.handleSearch} />
          </div>
        </Row>
        <Row>
        <div className='result_div' style={{ marginTop: '30px' }}>
          {isClicked && searchResults.length === 0 ? (
            <span style={{color:'white'}}>Oops, we don't have providers for the service you searched </span>
          ) : (
            <ListGroup as='ul' style={{width:'600px'}} className='list_hp'>
                {searchResults.map((result,index) => (
                    <ListGroup.Item as='li' eventKey={index.toString()} key={index}>
                        <Card>
                            <Card.Header>{result.activity_name}</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                  <Card.Link href='/services/contact' onClick={this.handleTitle}>{result.first_name} {result.last_name}</Card.Link>
                                  </Card.Title>
                              <Card.Text>{result.phone} {result.email}</Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
                </ListGroup> 
          )}
        </div>
        </Row>
      </div>
    );
  }
}


export default HomePage;
