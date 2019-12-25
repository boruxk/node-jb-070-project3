import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from "react-router-dom";
import { Redirect } from 'react-router';
import { container, ACTIONS } from "./store";
import { ToastContainer, toast } from 'react-toastify';
import { IconContext } from "react-icons";
import { TiSocialFacebook } from "react-icons/ti";
import { MdDelete, MdEdit } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
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
  const [loggedUser, setLoggedUser] = useState({});

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
      .then(data => {
        data = JSON.parse(data);
        const token = data.token;
        if (token !== "") {
          sessionStorage.setItem("token", token);
          setLoggedUser(data.user);
          setLogged(true);
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

  useEffect(() => {
    container.dispatch({
      type: ACTIONS.LOGGED,
      logged: logged,
      user: loggedUser
    });
  }, [loggedUser, logged]);

  if (logged === true) {
    return <Redirect to='/vacations' />
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

function Vacation(props) {
  const [id, setId] = useState();
  const [description, setDescription] = useState();
  const [target, setTarget] = useState();
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [price, setPrice] = useState();
  const [files, setFiles] = useState({ file: [] });

  const [deleted, setDeleted] = useState(false);
  const [edit, setEdit] = useState(false);

  //date transform
  const options = { year: 'numeric', month: '2-digit', day: 'numeric' };
  let datePartsD = props.vacation.date_departure.split("-");
  let jsDateD = new Date(datePartsD[0], datePartsD[1] - 1, datePartsD[2].substr(0, 2));
  let dated = jsDateD.toLocaleDateString('en-US', options);
  let datePartsA = props.vacation.date_arrival.split("-");
  let jsDateA = new Date(datePartsA[0], datePartsA[1] - 1, datePartsA[2].substr(0, 2));
  let datea = jsDateA.toLocaleDateString('en-US', options);

  const imageadress = `http://localhost:3200/uploads/${props.vacation.image}`;

  function follow(event) {
    event.preventDefault();
    //add follower to follow table
    //add follow to vacation
    //open socket
  }

  //EDIT
  function editV(event) {
    event.preventDefault();
    setId(props.vacation.id);
    setTarget(props.vacation.target);
    setDescription(props.vacation.description);
    setPrice(props.vacation.price);
    setStartdate(jsDateD);
    setEnddate(jsDateA);
    setEdit(true);
  }
  function getDescription(e) {
    setDescription(e.target.value)
  };
  function getTarget(e) {
    setTarget(e.target.value)
  };
  function getPrice(e) {
    setPrice(e.target.value)
  };

  function getImage(file) {
    setFiles({ image: file.target.files[0] });
  }
  function onSubmit(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append('id', id);
    formData.append('target', target);
    formData.append('description', description);
    formData.append('startdate', startdate);
    formData.append('enddate', enddate);
    formData.append('price', price);
    if (files.image !== undefined) {
      //edit with pic
      formData.set('image', files.image);
      fetch(`http://localhost:3200/vacations/${props.vacation.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
      })
        .then(res => res.text())
        .then(vacation => {
          vacation = JSON.parse(vacation);
          if (vacation.status === 200) {
            props.vacation.target = vacation.target;
            props.vacation.description = vacation.description;
            props.vacation.price = vacation.price;
            props.vacation.date_departure = vacation.date_departure;
            props.vacation.date_arrival = vacation.date_arrival;
            props.vacation.image = vacation.image;
            setEdit(false);
          }
        });
    } else {
      //edit without pic
      var object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });
      fetch(`http://localhost:3200/vacations/${props.vacation.id}`, {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
      })
        .then(res => res.text())
        .then(vacation => {
          vacation = JSON.parse(vacation);
          if (vacation.status === 200) {
            props.vacation.target = vacation.target;
            props.vacation.description = vacation.description;
            props.vacation.price = vacation.price;
            props.vacation.date_departure = vacation.date_departure;
            props.vacation.date_arrival = vacation.date_arrival;
            setEdit(false);
          }
        });
    }
  }

  //DELETE
  function deleteV() {
    fetch(`http://localhost:3200/vacations/${props.vacation.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + sessionStorage.getItem("token")
      }
    })
      .then(res => res.text())
      .then(data => {
        setDeleted(true);
      });
  }
//************************************************************ */
  const [admin, setAdmin] = useState(false);

  const [loggedUser, setLoggedUser] = useState();

  container.subscribe(() => {
    const _requestedData = container.getState().requestedData;
    
    if (_requestedData[0].user.role) {
      console.log(_requestedData[0].user.role);
      setLoggedUser(_requestedData[0].user.role);
    }
  });

  useEffect(() => {
    console.log(loggedUser);
    if (loggedUser === "admin") {
      setAdmin(true);
    }
  }, [loggedUser]);
//************************************************************ */
  if (deleted === true) {
    return <Redirect to='/vacations' />
  } else if (edit === true) {
    return (
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <form className="form-signin" id="form" onSubmit={onSubmit} encType="multipart/form-data">
              <input value={target} onChange={getTarget} className="form-control" id="target" name="target" required autoFocus></input>
              <textarea value={description} onChange={getDescription} className="form-control" id="description" name="description" required ></textarea>
              <DatePicker value={startdate} dateFormat="yyyy-MM-dd" selectsStart selected={startdate} onChange={date => setStartdate(date)} className="form-control" minDate={new Date()} required />
              <DatePicker value={enddate} dateFormat="yyyy-MM-dd" selectsEnd selected={enddate} onChange={date => setEnddate(date)} className="form-control" minDate={startdate} required />
              <input value={price} onChange={getPrice} className="form-control" id="price" name="price" required></input>
              <p>select image to replace existing or skip</p>
              <input onChange={getImage} name="image" id="image" type="file" className="btn btn-lg btn-outline-primary btn-block form-control"></input>
              <button id="save" className="btn btn-lg btn-primary btn-block form-control" type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="col-md-4">
        <div className="card">
          <img src={imageadress} className="card-img-top" alt={props.vacation.target}></img>
          <div className="card-body">
            <h6 className="card-title"><b>{props.vacation.target}</b></h6>
            <p className="description">{props.vacation.description}</p>
            <p>{dated} - {datea} <b className="price">{props.vacation.price}₪</b></p>
          </div>
          <div className="card-footer">
            <IconContext.Provider value={{ className: "soc" }}>
              <TiSocialFacebook onClick={follow} /> <span className="soc2">{props.vacation.follower} follower</span>
            </IconContext.Provider>
            {admin ? <IconContext.Provider value={{ className: "edit" }}>
              <MdDelete onClick={deleteV} className="delete" />
              <MdEdit onClick={editV} className="edit2" />
            </IconContext.Provider>
            : null}
          </div>
        </div>
      </div>
    )
  }
}

function Vacations() {
  const [vacations, setVacations] = useState([]);

  if (vacations.length === 0) {
    setTimeout(function () {
      fetch(`http://localhost:3200/vacations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(data => {
          setVacations(data);
        });
    }, 1000);
  }
  
  return (
    <div className="row">
      {vacations.map((vacation, i) => (
        <Vacation {...vacation} key={i} vacation={vacation}/>
      ))}
    </div>
  );
}

function AddVacation() {
  const [description, setDescription] = useState();
  const [target, setTarget] = useState();
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [price, setPrice] = useState();
  const [files, setFiles] = useState({ file: [] });
  const [saved, setSaved] = useState(false);

  function getDescription(e) {
    setDescription(e.target.value)
  };
  function getTarget(e) {
    setTarget(e.target.value)
  };
  function getPrice(e) {
    setPrice(e.target.value)
  };
  function getImage(file) {
    setFiles({ image: file.target.files[0] });
  }

  function onSubmit(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append('image', files.image);
    formData.append('target', target);
    formData.append('description', description);
    formData.append('startdate', startdate);
    formData.append('enddate', enddate);
    formData.append('price', price);
    fetch(`http://localhost:3200/vacations`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'bearer ' + sessionStorage.getItem("token")
      }
    })
      .then(res => res.text())
      .then(vacation => {
        vacation = JSON.parse(vacation);
        if (vacation.status === 200) {
          setSaved(true);
        }
      });
  }

  if (saved === true) {
    return <Redirect to='/vacations' />
  } else {
    return (
      <div className="card">
        <div className="card-body">
          <form className="form-signin" id="form" onSubmit={onSubmit} encType="multipart/form-data">
            <h3 className="mb-3 font-weight-normal text-center" id="cap">Add vacation</h3>
            <input onChange={getTarget} className="form-control" id="target" name="target" placeholder="Target" required autoFocus></input>
            <textarea onChange={getDescription} className="form-control" id="description" name="description" placeholder="Description" required ></textarea>
            <DatePicker dateFormat="yyyy-MM-dd" selectsStart selected={startdate} onChange={date => setStartdate(date)} placeholderText="select date" className="form-control" minDate={new Date()} required />
            <DatePicker dateFormat="yyyy-MM-dd" selectsEnd selected={enddate} onChange={date => setEnddate(date)} placeholderText="return date" className="form-control" minDate={startdate} required />
            <input onChange={getPrice} className="form-control" id="price" name="price" placeholder="Price" required></input>
            <input onChange={getImage} name="image" id="image" type="file" className="btn btn-lg btn-outline-primary btn-block form-control"></input>
            <button id="register" className="btn btn-lg btn-primary btn-block form-control" type="submit">Add vacation</button>
          </form>
        </div>
      </div>
    )
  }
}

function Header() {
  const [logged, setLogged] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});

  container.subscribe(() => {
    const _requestedData = container.getState().requestedData;
    if (_requestedData[0].logged) {
      setLogged(_requestedData[0].logged);
    }
    if (_requestedData[0].user) {
      setLoggedUser(_requestedData[0].user);
    }
  });

  function logout() {
    sessionStorage.removeItem('token');
    setLogged(false);
    setAdmin(false);
  }

  useEffect(() => {
    if (loggedUser.role === "admin") {
      setAdmin(true);
    }
  }, [loggedUser]);

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          <div className="date">
            <ul id="nav" className="list-group list-group-horizontal">
              {logged ? null :
                <>
                  <li className="list-group-item">
                    <Link to="/">Login</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/register">Register</Link>
                  </li>
                </>
              }
              {logged ?
                <>
                  <li className="list-group-item">
                    <Link to="/vacations">Vacations</Link>
                  </li>
                  {admin ?
                    <li className="list-group-item">
                      <Link to="/addvacation">Add vacation</Link>
                    </li>
                    : null}
                  <li className="list-group-item">
                    <Link to="/" onClick={logout}>Logout</Link>
                  </li>
                </>
                : null}
            </ul>
            {logged ?
              <div className="hello">
                Hello, {loggedUser.username}
              </div>
              : null}
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
        <Switch key={"nav"}>
          <Route component={Header} />
          
        </Switch>
        <Switch key={"comps"}>
          <Route path="/" exact component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/vacations" component={Vacations} />
          <Route path="/addvacation" component={AddVacation} />
        </Switch>
      </div>
    </Router>
  );
}

const WithRouterApp = withRouter(App);
export default WithRouterApp;
