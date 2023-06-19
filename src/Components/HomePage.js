import React, { Component } from 'react';
import NavBar from "./NavBar";
import UserNavBar from "./UserNavBar";
import SearchBar from "./SearchBar";
import { auth } from "../firebase";
import './css/HPage_style.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
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

  componentDidUpdate(prevProps, prevState){
    if (prevState.connected !== this.state.connected) {
        if (!auth.currentUser) {
          this.setState({ connected: false });
        }
    }
  }

  handleSearch = async (searchTerm) => {
    if(this.state.connected){
        console.log('connected searched '+searchTerm);
        
    }
    else{
        console.log('disconneted '+searchTerm)
    }
  }


  render() {
    const { connected } = this.state;

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

        <h1>Find the service you need near you</h1>
        <div className='search-bar'>
          <br />
          <SearchBar onSearch={this.handleSearch} />
        </div>
        <div className='result_div'>
        </div>
      </div>
    );
  }
}

export default HomePage;
