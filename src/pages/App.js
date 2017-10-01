import React, {Component} from 'react';
import firebase, {auth, provider} from '../js/firebase.js';
import logo from '../images/QNH_logo_totaal_blauw transparant.png';
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
  UncontrolledAlert,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
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
      selected: [],
      file: {
        fileName: '',
        fileTheme: '',
        fileDesc: '',
        fileUrl: ''
      },
      modal: false,
      user: null
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
    this.login = this
      .login
      .bind(this);
    this.logout = this
      .logout
      .bind(this);
    this.toggleModal = this
      .toggleModal
      .bind(this);
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  login() {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        var allowed = false;

        const filesRef = firebase
          .database()
          .ref('allowed');
        filesRef.on('value', (snapshot) => {
          let files = snapshot.val();
          for (let file in files) {
            if (user.email === files[file].email) {
              allowed = true;
            }
          }
          if (allowed) {
            this.setState({user});
          } else {
            alert("Geen toegang!")
            this.logout();
          }
        });
      });
  }

  logout() {
    auth
      .signOut()
      .then(() => {
        this.setState({user: null});
      });
  }

  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const id = target.id;
    this.setState({[id]: value});
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
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({user});
      }
    });

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
        })
        .catch(function (error) {
          alert(error.message)
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
              {this.state.user
                ? <NavItem>
                    <NavLink onClick={this.logout}>Logout</NavLink>
                  </NavItem>
                : <NavItem>
                  <NavLink onClick={this.login}>Login</NavLink>
                </NavItem>
}
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
          <img src={logo}  width="250" onClick={() => window.open("https://www.qnh.eu/")} className="App-logo" alt="logo"/>
          <br/><br/>
            <p className="lead">QNH helpt organisaties met het bijsturen en verbeteren van
              hun bedrijfsvoering, door de inzet van slimme IT oplossingen. Dit doen we
              middels de thema’s{' '}
              <a
                className="link"
                target="_blank"
                rel="noopener"
                href={`https://qnh.eu/thema/business-analytics/`}>
                Business Analytics</a>,{' '}
              <a
                target="_blank"
                className="link"
                rel="noopener"
                href={`https://qnh.eu/thema/cloud/`}>
                Cloud</a>,{' '}
              <a
                target="_blank"
                className="link"
                rel="noopener"
                href={`https://qnh.eu/thema/collaboration/`}>
                Collaboration</a>,{' '}
              <a
                target="_blank"
                className ="link"
                rel="noopener"
                href={`https://qnh.eu/thema/enterprise-mobility/`}>
                Enterprise Mobility</a>,{' '}
              <a
                target="_blank"
                className ="link"
                rel="noopener"
                href={`https://qnh.eu/thema/digital-experience/`}>
                Digital Experience</a>.</p>
            <hr className="my-2"/>
            <p className="lead">Kennis is er om te delen! Vink de documenten aan, vul uw
              gegevens in en klik op ‘Versturen’. U ontvangt de documenten vervolgens in uw
              mail.</p>
          </Col>
        </Jumbotron>

        <Modal
          id="fileModal"
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>{this.state.file.fileName}</ModalHeader>
          <ModalBody>
            {this.state.file.fileDesc}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>Terug</Button>{' '}
          </ModalFooter>
        </Modal>

        <ReactTable
          getTdProps={(state, rowInfo, column, instance) => {
          return {
 
            onClick: (e, handleOriginal) => {
              if (column.id !== "checkbox" && rowInfo !== undefined) {
                this.setState({file: rowInfo.original});
                this.toggleModal()
              }
            }
          }
        }}
          showPagination={true}
          defaultPageSize ="10"
          data={this.state.items}
          columns={[
          {
            id: "checkbox",
            accessor: "checkbox",
            maxWidth: 25,
            Cell: ({original}) => {
              return (<input
                type="checkbox"
                className="checkbox"
                onChange={() => this.toggleRow(original.fileUrl)}/>);
            }
          }, {
            Header: 'Naam',
            accessor: 'fileName'
          }, {
            Header: 'Thema',
            accessor: 'fileTheme'
          }
        ]}/>

        <Jumbotron fluid>
          <Col
            sm={{
            size: 6,
            push: 2,
            pull: 2,
            offset: 1
          }}>
            <FormGroup>
              <UncontrolledAlert id="alertSucces" color="success" hidden>
                Succesvol verstuurd!
              </UncontrolledAlert>
              <UncontrolledAlert id="alertFail" color="danger" hidden>
                Alle velden zijn vereist!
              </UncontrolledAlert>
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
                placeholder="Bedrijfsnaam"/>
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
              <Button className="button" onClick={this.handleSubmit}>Versturen</Button>
              <br/>
            </FormGroup>
          </Col>
        </Jumbotron>

        <Jumbotron className="footer" fluid>
          <Col
            sm={{
            size: 6,
            push: 2,
            pull: 2,
            offset: 1
          }}>
            <Container fluid>
              <p className="lead">© 2017{' '}
                <a
                  target="_blank"
                  rel="noopener"
                  href={`http://qnh.eu/wp-content/uploads/QNH-Leveringsvoorwaarden-2017.pdf`}>
                  QNH - Algemene Voorwaarden</a>
              </p>
            </Container>
          </Col>
        </Jumbotron>

        {this.state.user
          ? <Col
              sm={{
              size: 6,
              push: 2,
              pull: 2,
              offset: 1
            }}>
              <br/><Input type="file" id="fileUpload" placeholder="Bestands selecteren"/>
              <Input type="text" id="fileName" placeholder="Bestand Naam"/>
              <Input type="select" id="fileTheme" placeholder="Bestand Thema">
                <option>Business Analytics</option>
                <option>Cloud</option>
                <option>Collaboration</option>
                <option>Enterprise Mobility</option>
                <option>Digital Experience</option>
              </Input>
              <Input type="textarea" id="fileDesc" placeholder="Bestand Omschrijving"/>
              <br/>
              <Button className="button" onClick={this.handleUpload}>Versturen</Button>
            </Col>
          : <div/>
}
      </div>
    );
  }
}
