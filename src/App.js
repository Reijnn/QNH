import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js';

//const storage = firebase.storage();
const database = firebase.database();

class App extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      email: ''
    }
    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = database.ref('clients');

    const item = {
      name: this.state.name,
      email: this.state.email
    }
    itemsRef.push(item);

    itemsRef.on('value', (snapshot) => {
      console.log(snapshot.val());
    });

    this.setState({name: '', email: ''});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h2>Welcome to QNH</h2>
        </div>
        <div className='container'>
          <section className='add-item'>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Volledige naam"
                onChange={this.handleChange}
                value={this.state.name}/>
              <input
                type="text"
                name="email"
                placeholder="Wat is je email?"
                onChange={this.handleChange}
                value={this.state.email}/>
              <button>Versturen</button>
            </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul></ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
