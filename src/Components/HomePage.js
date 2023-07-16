import React, { Component } from 'react';
import NavBar from "./NavBar";
import UserNavBar from "./UserNavBar";
import SearchBar from "./SearchBar";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc,limit } from 'firebase/firestore';
import './css/HPage_style.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import AdminNavBar from './Admin/AdminNavBar';



class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      userData: null,
      searchResults: [],
      isClicked: false,
      selectedContact: null,
      loading: true, 
    };
  }


  componentDidMount() {
    const user = auth.currentUser;
    if (user && user.emailVerified) {
      this.setState({ connected: true });
  
      // Récupérer les données de l'utilisateur depuis Firestore
      const userRef = doc(db, 'users', user.uid);
      this.setState({ loading: true }); // Définir l'état de chargement sur true
  
      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            this.setState({ userData, loading: false }); // Définir l'état de chargement sur false une fois les données récupérées
          } else {
            this.setState({ loading: false }); // Définir l'état de chargement sur false en cas d'utilisateur non trouvé
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
          this.setState({ loading: false }); // Définir l'état de chargement sur false en cas d'erreur
        });
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


  handleSearch = async (searchTerm) => {
    this.setState({ isClicked: true });
  
    const activityQuery = query(
      collection(db, 'providers'),
      where('activity_name', '>=', searchTerm.toUpperCase()),
      where('activity_name', '<=', searchTerm.toUpperCase() + '\uf8ff'),
      limit(10)
    );
  
    const countryQuery = query(
      collection(db, 'providers'),
      where('country', '>=', searchTerm.toUpperCase()),
      where('country', '<=', searchTerm.toUpperCase() + '\uf8ff'),
      limit(10)
    );
  
    const activitySnapshot = await getDocs(activityQuery);
    const countrySnapshot = await getDocs(countryQuery);
  
    const activityDocuments = activitySnapshot.docs.map((doc) => doc.data());
    const countryDocuments = countrySnapshot.docs.map((doc) => doc.data());
  
    const documents = [...activityDocuments, ...countryDocuments].filter((doc) => {
      return (
        doc.activity_name.toUpperCase().includes(searchTerm.toUpperCase()) ||
        doc.country.toUpperCase().includes(searchTerm.toUpperCase())
      );
    });
  
    console.log(documents);
    this.setState({ searchResults: documents });
  };
  

  
  render() {
    const { connected, searchResults, isClicked, userData, loading } = this.state;

    let navbar = null;
      if (connected) {
        if (loading) {
          navbar = <div>Loading...</div>;
        } else {
          if (userData && userData.pseudo === 'admin') {
            navbar = <AdminNavBar />;
          } else {
            navbar = <UserNavBar />;
          }
        }
      } else {
        navbar = <NavBar />;
      }

    return (
      <div className="homepage">

        {navbar}
        {/* {connected ? (
          <div>
            {userData.pseudo === 'admin' ? (
              <AdminNavBar/>
            ): (
              <UserNavBar/>
            )}
            
            <br />
          </div>
        ) : (
          <div>
            <NavBar />
            <br />
          </div>
        )} */}
        

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
                                  <Card.Link href={`/services/contact/${result.user_id}`}>{result.first_name} {result.last_name}</Card.Link>
                                  </Card.Title>
                                  <Card.Subtitle>{result.country}</Card.Subtitle>
                              <Card.Text>{result.phone} </Card.Text>
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
