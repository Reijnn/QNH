import React, {Component} from 'react';
import './App.css';
import firebase from './firebase.js';

const storage = firebase.storage();
const database = firebase.database();

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      items: []
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
    const clientsRef = database.ref('clients');

    const item = {
      name: this.state.name,
      email: this.state.email
    }
    clientsRef.push(item);
    this.setState({name: '', email: ''});
  }

  componentDidMount() {
    const filesRef = firebase
      .database()
      .ref('files');
    filesRef.on('value', (snapshot) => {
      let files = snapshot.val();
      let newState = [];
      for (let file in files) {
        newState.push({id: file, name: files[file].name, url: files[file].url});
      }
      this.setState({items: newState});
    });
  }

  handleUpload(e) {
    e.preventDefault();
    var file = document
      .getElementById("upload")
      .files[0];
    var storageRef = storage.ref(file.name);
    storageRef
      .put(file)
      .then(function (snapshot) {
        var fileRef = database.ref('files');

        const item = {
          name: file.name,
          url: snapshot.downloadURL
        };

        fileRef.push(item);
        alert('Succes');
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
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
            <form onSubmit={this.handleUpload}>
              <p>
                <input type="file" id="upload"/>
                <button id="opsturen">Opsturen</button>
              </p>
            </form>
          </section>
          <section className='display-item'>
            <div className="wrapper">
              <ul>
                {this
                  .state
                  .items
                  .map((item) => {
                    return (
                      <li key={item.id}>
                        <span onClick={() => window.open(item.url)}>{item.name}</span>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
