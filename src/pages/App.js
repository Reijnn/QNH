import React, {Component} from 'react';
import firebase from '../js/firebase.js';
//import logo from '../images/';
import ReactTable from 'react-table'
import '../pages/app.css'
import 'react-table/react-table.css'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Jumbotron,
  Button,
  Label,
  Alert,
  FormGroup,
  Input,
  Col,
  Container
} from 'reactstrap';

const storage = firebase.storage();
const database = firebase.database();

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      clientName: '',
      clientEmail: '',
      clientCompany: '',
      clientContact: false,
      items: [],
      selected: []
    }

    this.toggle = this
      .toggle
      .bind(this);
    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const id = target.id;
    this.setState({
      [id]: value
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const clientsRef = database.ref('clients');

    if (this.state.clientEmail && this.state.clientName && this.state.clientCompany !== "") {
      const item = {
        clientName: this.state.clientName,
        clientCompany: this.state.clientCompany,
        clientEmail: this.state.clientEmail, 
        clientContact: this.state.clientContact
      }
      clientsRef.push(item);
      this.setState({clientName: '', clientEmail: '', clientCompany: '', clientContact: ''});
      document
        .getElementById("alertSucces")
        .removeAttribute("hidden")
    } else {
      document
        .getElementById("alertFail")
        .removeAttribute("hidden")
    }
  }

  componentDidMount() {
    const filesRef = firebase
      .database()
      .ref('files');
    filesRef.on('value', (snapshot) => {
      let files = snapshot.val();
      let newState = [];
      for (let file in files) {
        newState.push({fileId: file, fileName: files[file].fileName, fileDesc: files[file].fileDesc, fileTheme: files[file].fileTheme, fileUrl: files[file].fileUrl});
      }
      this.setState({items: newState});
    });
  }

  toggleRow(url) {
    const newSelected = Object.assign({}, this.state.selected);
    newSelected[url] = !this.state.selected[url];
    this.setState({selected: newSelected});
  }

  handleUpload(e) {
    e.preventDefault();

    var file = document
      .getElementById("fileUpload")
      .files[0];
    if (file) {
      var storageRef = storage.ref(file.name);
      storageRef
        .put(file)
        .then(function (snapshot) {
          var fileRef = database.ref('files');

          const item = {
            fileName: document
              .getElementById("fileName")
              .value,
            fileTheme: document
              .getElementById("fileTheme")
              .value,
            fileDesc: document
              .getElementById("fileDesc")
              .value,
            fileUrl: snapshot.downloadURL
          };

          fileRef.push(item);
          alert('Succes');
        });
    } else {
      alert('Selecteer eerst een bestand.')
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar color="faded" light toggleable>
          <NavbarToggler right onClick={this.toggle}/>
          <NavbarBrand href="/">
            QNH Consulting
          </NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="#">Login</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Jumbotron>
          <Col
            sm={{
            size: 6,
            push: 2,
            pull: 2,
            offset: 1
          }}>
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <p className="lead">QNH helpt organisaties met het bijsturen en verbeteren van
              hun bedrijfsvoering, door de inzet van slimme IT oplossingen. Dit doen we
              middels de thema’s{' '}
              <a
                target="_blank"
                rel="noopener"
                href={`https://qnh.eu/thema/business-analytics/`}>
                Business Analytics</a>,{' '}
              <a target="_blank" rel="noopener" href={`https://qnh.eu/thema/cloud/`}>
                Cloud</a>,{' '}
              <a target="_blank" rel="noopener" href={`https://qnh.eu/thema/collaboration/`}>
                Collaboration</a>,{' '}
              <a
                target="_blank"
                rel="noopener"
                href={`https://qnh.eu/thema/enterprise-mobility/`}>
                Enterprise Mobility</a>,{' '}
              <a
                target="_blank"
                rel="noopener"
                href={`https://qnh.eu/thema/digital-experience/`}>
                Digital Experience</a>.</p>
            <hr className="my-2"/>
            <p>Partnership in IT</p>
          </Col>
        </Jumbotron>

        <ReactTable
          getTdProps={(state, rowInfo, column, instance) => {
          return {
            onClick: (e, handleOriginal) => {
              console.log('A Td Element was clicked!')
            }
          }
        }}
          defaultPageSize={10}
          showPagination={false}
          data={this.state.items}
          columns={[
          {
            id: "checkbox",
            accessor: "",
            Cell: ({original}) => {
              return (<input
                type="checkbox"
                className="checkbox"
                onChange={() => this.toggleRow(original.fileUrl)}/>);
            }
          }, {
            Header: 'Name',
            accessor: 'fileName'
          }, {
            Header: 'Thema',
            accessor: 'filetheme'
          }
        ]}/>

        <Jumbotron fluid>
          <Container fluid>
            <Col
              sm={{
              size: 6,
              push: 2,
              pull: 2,
              offset: 1
            }}>
              <p className="lead">Kennis is er om te delen! Vink de documenten aan, vul uw
                gegevens in en klik op ‘verstuur’. U ontvangt de documenten vervolgens in uw
                mail.</p>
            </Col>
          </Container>
        </Jumbotron>
        <br/>

        <Col
          sm={{
          size: 6,
          push: 2,
          pull: 2,
          offset: 1
        }}>
          <FormGroup>
            <Alert id="alertSucces" color="success" hidden>
              Email succesvol verstuurd.
            </Alert>
            <Alert id="alertFail" color="danger" hidden>
              Naam en email zijn vereist.
            </Alert>
            <Input
              type="text"
              id="clientName"
              placeholder="Volledige naam"
              onChange={this.handleChange}
              value={this.state.clientName}/>
            <Input
              type="text"
              id="clientCompany"
              onChange={this.handleChange}
              value={this.state.clientCompany}
              placeholder="Bedrijf's naam"/>
            <Input
              type="email"
              id="clientEmail"
              placeholder="Email"
              onChange={this.handleChange}
              value={this.state.clientEmail}/>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  id="clientContact"
                  onChange={this.handleChange}
                  value={this.state.clientContact}/>{' '}
                Ik wil op de hoogte gehouden worden van nieuwe whitepapers, evenementen of
                andere inhoudelijke zaken.
              </Label>
            </FormGroup>
            <Button color="primary" onClick={this.handleSubmit}>Versturen</Button>

            <br/>
          </FormGroup>
        </Col>

        <Jumbotron fluid>
          <Container fluid>
            <Col
              sm={{
              size: 6,
              push: 2,
              pull: 2,
              offset: 1
            }}>
              <p className="lead">© 2017{' '}
                <a
                  target="_blank"
                  rel="noopener"
                  href={`http://qnh.eu/wp-content/uploads/QNH-Leveringsvoorwaarden-2017.pdf`}>
                  QNH - Algemene Voorwaarden</a>
              </p>
            </Col>
          </Container>
        </Jumbotron>

        {/* <FormGroup>
          <Input type="file" id="fileUpload" placeholder="Bestands selecteren"/>
          <Input type="text" id="fileName" placeholder="Bestand naam"/>
          <Input type="text" id="filetheme" placeholder="Bestand Thema"/>
          <Input type="text" id="fileDesc" placeholder="Bestand Omschrijving"/>
          <Button color="primary" onClick={this.handleUpload}>Versturen</Button>
        </FormGroup>

        <Button color="info" onClick={() => console.log(this.state.selected)}>Bestanden</Button> */}
      </div>
    );
  }
}