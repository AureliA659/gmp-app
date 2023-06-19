import React from "react";
import './css/SearchBar.css';



class TestComp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
            <input type="text" className="input-text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" className="send-but" value="Search" />
        </form>
      );
    }
  }


export default TestComp;