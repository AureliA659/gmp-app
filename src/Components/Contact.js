import React from "react";
import { auth } from "../firebase";
import UserNavBar from "./UserNavBar";
import NavBar from "./NavBar";
import ListServices from "./ListServices";



class Contact extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            connected: false,
            result : this.props
        }
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

    handleH = ()=>{
        console.log('blur ' + this.result)
    }

    render(){
        const {connected, result} = this.state;

        return(
            <div>
                <div>
                { connected ? (
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
                </div>
                <button onClick={this.handleH}>Click me</button>
            </div>
        )
    }
}

export default Contact