import React, { Component } from 'react';
import { db, auth } from '../firebase';
import { collection, limit, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import './css/SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      searchTerm: '',
      suggestions: [],
      userData: null,
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

  fetchUserData = async () => {
    const user = auth.currentUser;
    const userRef = doc(db, 'users', user.uid);
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      this.setState({ userData: docSnapshot.data() });
    }
  };

  handleInputChange = (event) => {
    const { value } = event.target;
    this.setState({ searchTerm: value }, this.fetchSuggestions);
  };

  fetchSuggestions = async () => {
    const { searchTerm } = this.state;
    if (searchTerm.length > 0) {
      const activitiesRef = collection(db, 'providers');
      const q = query(
        activitiesRef,
        where('activity_name', '>=', searchTerm.toUpperCase()),
        where('activity_name', '<=', searchTerm.toUpperCase() + '\uf8ff'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs.map((doc) => doc.data().activity_name);
      this.setState({ suggestions: activities });
    } else {
      this.setState({ suggestions: [] });
    }
  };

  handleSelectSuggestion = (suggestion) => {
    this.setState({ searchTerm: suggestion, suggestions: [] });
  };

  handleSearch = async () => {
    const { connected, searchTerm, userData } = this.state;
    console.log(searchTerm);
    console.log(connected);
    if (connected && userData) {
      try {
        // Ajouter la valeur de recherche à la sous-collection "searches" de l'utilisateur
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const searchDocRef = doc(userRef, 'history', searchTerm);
        
        // Vérifier si le document de recherche existe déjà
        const searchDocSnapshot = await getDoc(searchDocRef);
        if (searchDocSnapshot.exists()) {
          console.log('The doc still exists');
        } else {
          // Créer un nouveau document de recherche avec la valeur de recherche comme données
          await setDoc(searchDocRef, { search : searchTerm });
          console.log('saved with success');
        }
      } catch (error) {
        console.error('An error occured ', error);
      }
    
    } else {
      console.log('bye');
    }
    this.props.onSearch(searchTerm);
  };

  render() {
    const { searchTerm, suggestions } = this.state;

    return (
      <div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={this.handleInputChange}
            placeholder="Enter a service you are looking for..."
            className="input-text"
          />

          <button onClick={this.handleSearch} className="send-but">
            Search
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="serchList">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => this.handleSelectSuggestion(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default SearchBar;
