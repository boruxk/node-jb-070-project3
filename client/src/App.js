import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Register() {
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [user, setUser] = useState();
  const [pass, setPass] = useState();
  const [registered, setRegistered] = useState(false);

  function getFname(e) {
    setFname(btoa(e.target.value))
  };
  function getLname(e) {
    setLname(btoa(e.target.value))
  };
  function getUser(e) {
    setUser(btoa(e.target.value))
  };
  function getPass(e) {
    setPass(btoa(e.target.value))
  };

  function onSubmit(event) {
    event.preventDefault();
    const data = {
      fname: fname,
      lname: lname,
      user: user,
      pass: pass
    };
    fetch(`http://localhost:3200/register`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.text())
      .then(user => {
        user = JSON.parse(user);
        console.log(user);
                
        if (!user.id) {
          setRegistered(true);
        } else {
          toast.error("Username is occupied!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false
          });
        }
      });
  }
  if (registered === true) {
    return <Redirect to='/' />
  } else {
    return (
      <div className="card">
        <div className="card-body">
          <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggable={false} pauseOnHover={false} />
          <form className="form-signin" id="form" onSubmit={onSubmit}>
            <h3 className="mb-3 font-weight-normal text-center" id="cap">Register</h3>
            <input onChange={getFname} className="form-control" id="firstname" name="firstname" placeholder="First name" required autoFocus></input>
            <input onChange={getLname} className="form-control" id="lastname" name="lastname" placeholder="Last Name" required ></input>
            <input onChange={getUser} className="form-control" id="user" name="user" placeholder="User" required ></input>
            <input onChange={getPass} className="form-control" id="pass" name="pass" placeholder="Password" required></input>
            <button id="register" className="btn btn-lg btn-primary btn-block form-control" type="submit">Register</button>
          </form>
        </div>
      </div>
    );
  }
}

function Login() {
  const [user, setUser] = useState();
  const [pass, setPass] = useState();
  const [logged, setLogged] = useState(false);

  function getUser(e) {
    setUser(btoa(e.target.value))
  };
  function getPass(e) {
    setPass(btoa(e.target.value))
  };

  function onSubmit(event) {
    event.preventDefault();
    const data = {
      user: user,
      pass: pass
    };
    fetch(`http://localhost:3200/login`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.text())
      .then(token => {
        if (token !== "") {
          setLogged(true);
          sessionStorage.setItem("token", token);
        } else {
          toast.error("Username or Password wrong!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false
          });
        }
      });
  }

  if (logged === true) {
    return <Redirect to='/vocations' />
  } else {
    return (
      <div className="card">
        <div className="card-body">
          <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggable={false} pauseOnHover={false} />
          <form className="form-signin" id="form" onSubmit={onSubmit}>
            <h3 className="mb-3 font-weight-normal text-center" id="cap">Login</h3>
            <input onChange={getUser} className="form-control" id="user" name="user" placeholder="User" required autoFocus></input>
            <input onChange={getPass} className="form-control" id="pass" name="pass" placeholder="Password" required></input>
            <button id="login" className="btn btn-lg btn-primary btn-block form-control" type="submit">Login</button>
            <Link to="/register">New User? register</Link>
          </form>
        </div>
      </div>
    );
  }
}

function Vocation() {
  return (
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">

        </div>
        <div className="card-footer">
          <p>Dates</p>
        </div>
      </div>
    </div>
  );
}

function Vocations() {
  const [vocations, setVocations] = useState([]);
  return (
    <div className="row">
      {vocations.map((vocation, i) => (
        <Vocation {...vocation} key={i} vocation={vocation} />
      ))}
    </div>
  );
}

function Header() {
  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          <div className="date">
            <ul id="nav" className="list-group list-group-horizontal">
              <li className="list-group-item">
                <Link to="/">Login</Link>
              </li>
              <li className="list-group-item">
                <Link to="/register">Register</Link>
              </li>
              <li className="list-group-item">
                <Link to="/vocations">Vocations</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="row">
          <Header />
        </nav>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/vocations" component={Vocations} />
      </div>
    </Router>
  );
}

export default App;
