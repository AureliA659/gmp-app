import React, { Component } from 'react';
import { db, auth } from '../firebase';
import { collection, limit, query, where, getDocs, doc, getDoc, setDoc, orderBy } from 'firebase/firestore';
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

  // fetchSuggestions = async () => {
  //   const { searchTerm } = this.state;
  //   if (searchTerm.length > 0) {
  //     const sToUp = searchTerm.toUpperCase();
  //     const activitiesRef = collection(db, 'providers');
  //     const q = query(
  //       activitiesRef,
  //       where('activity_name', '>=', sToUp),
  //       where('activity_name', '<=', sToUp + '\uf8ff'),
  //       limit(10)
  //     );
  //     const querySnapshot = await getDocs(q);
  //     const activities = querySnapshot.docs.map((doc) => doc.data().activity_name);
  //     this.setState({ suggestions: activities });
  //   } else {
  //     this.setState({ suggestions: [] });
  //   }
  // };

  fetchSuggestions = async () => {
    const { searchTerm } = this.state;
    if (searchTerm.length > 0) {
      const searchTermUpper = searchTerm.toUpperCase();
  
      const activitiesRef = collection(db, 'providers');
  
      const activityQuery = query(
        activitiesRef,
        where('activity_name', '>=', searchTermUpper),
        where('activity_name', '<=', searchTermUpper + '\uf8ff'),
        limit(10)
      );
  
      const countryQuery = query(
        activitiesRef,
        where('country', '>=', searchTermUpper),
        where('country', '<=', searchTermUpper + '\uf8ff'),
        limit(10)
      );
  
      const activitySnapshot = await getDocs(activityQuery);
      const countrySnapshot = await getDocs(countryQuery);
  
      const activityNames = activitySnapshot.docs.map((doc) => doc.data().activity_name);
      const countryNames = countrySnapshot.docs.map((doc) => doc.data().country);
  
      const suggestions = [...activityNames, ...countryNames];
  
      this.setState({ suggestions });
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
        // add value to the subcollection 
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const searchDocRef = doc(userRef, 'history', searchTerm);
        
        // const searchDocSnapshot = await getDoc(searchDocRef);
        // if (searchDocSnapshot.exists()) {
        //   console.log('The doc still exists');
        // } else {
          
          await setDoc(searchDocRef, { search : searchTerm });
          console.log('saved with success');
        // }
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
            placeholder="Enter a service you are looking for, or a country..."
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
