import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super()
      this.state = {
        apiError: false,
        apiSuccess: false,
        student: {name: "", dob:""},
        submitted: false
      }

      this.apiPath = 'http://localhost:4000/users/';
      this.apiHeaders = {'Content-Type': 'application/json'};

      this.handleStudentDelete = this.handleStudentDelete.bind(this)
      this.handleStudentAdd = this.handleStudentAdd.bind(this)
      this.handleAddStudentChange = this.handleAddStudentChange.bind(this)

  }


  async handleStudentDelete(obj) {
    try  {
      let response = null; 
      let data = null;
      response = await fetch(this.apiPath, {method: "delete", body: JSON.stringify(obj), headers: this.apiHeaders})
      data = await response.json()
      this.setState({apiSuccess: data})
    } catch(e) {
      console.error(e)
      this.setState({apiError: e})
    }
  }

  async handleStudentAdd() {
     
    try {
      const student = this.state.student
      let response = null; 
      let data = null;
      response = await fetch(this.apiPath, {method: "post", body: JSON.stringify(student), headers: this.apiHeaders})
      data = response.json()
      this.setState({apiSuccess: data, submitted: JSON.stringify(student)})
    } catch(e) {
      console.error(e)
      this.setState({apiError: e})
    }
    
    

  }

  handleAddStudentChange(event) {
    const student = {name: this.state.student.name, dob: this.state.student.dob}

    if(event.target.name === 'name') {
      student.name = event.target.value
    } else {
      student.dob = event.target.value
    }
    this.setState({student})
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  async componentDidMount() {
    try {
      let response = null; 
      let data = null;
      response = await fetch(this.apiPath)
      data = await response.json()
      this.setState({ apiSuccess: data })
    } catch(e) {
      console.log(e)
      this.setState({ apiError: e })
    }
  }


  render() {
    const formMargin = {margin: "5px 15px"};

    const studentsInsert = this.state.apiSuccess ? this.state.apiSuccess.map((e, idx) => {
     return  <div key={idx} style={{display: "flex", justifyContent: "center"}}>
                <p style={formMargin}>{e.name}</p>
                <p style={formMargin}>{e.dob}</p>
                <button style={formMargin} className="btn btn-light" onClick={()=>this.handleStudentDelete(e)}>Delete</button>
            </div>
    }) : <div>There are no students listed</div>;

    return (
      <div className="App container">
        <header className="App-header">

          <div>
            <p>Students</p>
            <div>
              {studentsInsert}
            </div>

            <br />
          </div>

          <div>

            <p>Add a student</p>
            <form onSubmit={this.handleStudentAdd} style={{justifyContent: "center", display: "flex"}}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <input className="form-control" type="text" placeholder="name" onChange={this.handleAddStudentChange} name="name"/>
                <input className="form-control" type="text" placeholder="Date of Birth (yyyy-mm-dd)" name="dob" pattern="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])" onChange={this.handleAddStudentChange} />
                <button className="btn btn-light" type="submit">Submit</button>
              </div>
            </div>

            </form>
          </div>

        </header>
      </div>
    );
  }
}

export default App;