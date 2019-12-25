import React, { useState, useEffect } from 'react';
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
import io from 'socket.io-client';
import Chart from 'chart.js';
import { Bar } from 'react-chartjs-2';
const socket = io('http://localhost:3100');


function Register(props) {
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [user, setUser] = useState();
    const [pass, setPass] = useState();

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
                    props.nav("login");
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

function Login(props) {
    const [user, setUser] = useState();
    const [pass, setPass] = useState();

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
                    props.logging(data.user, true);
                    props.nav("vacations");
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

    function register() {
        props.nav("register");
    }

    return (
        <div className="card">
            <div className="card-body">
                <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggable={false} pauseOnHover={false} />
                <form className="form-signin" id="form" onSubmit={onSubmit}>
                    <h3 className="mb-3 font-weight-normal text-center" id="cap">Login</h3>
                    <input onChange={getUser} className="form-control" id="user" name="user" placeholder="User" required autoFocus></input>
                    <input onChange={getPass} className="form-control" id="pass" name="pass" placeholder="Password" required></input>
                    <button id="login" className="btn btn-lg btn-primary btn-block form-control" type="submit">Login</button>
                    <p className="navlink" onClick={register}>New User? register</p>
                </form>
            </div>
        </div>
    );
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

    const [following, setFollowing] = useState();

    //date transform
    const options = { year: 'numeric', month: '2-digit', day: 'numeric' };
    let datePartsD = props.vacation.date_departure.split("-");
    let jsDateD = new Date(datePartsD[0], datePartsD[1] - 1, datePartsD[2].substr(0, 2));
    let dated = jsDateD.toLocaleDateString('en-US', options);
    let datePartsA = props.vacation.date_arrival.split("-");
    let jsDateA = new Date(datePartsA[0], datePartsA[1] - 1, datePartsA[2].substr(0, 2));
    let datea = jsDateA.toLocaleDateString('en-US', options);

    const imageadress = `http://localhost:3200/uploads/${props.vacation.image}`;

    //FOLLOW
    function follow(event) {
        event.preventDefault();
        let data = {
            userid: props.user.id,
            vacationid: props.vacation.id
        }
        fetch(`http://localhost:3200/follow`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
            .then(res => res.text())
            .then(data => {
            });
        props.nav("vacations");

    }

    useEffect(() => {
        let followNum = 0;
        for (let i = 0; i < props.follow.length; i++) {
            if (props.follow[i].id_vocation === props.vacation.id) {
                followNum++;
            }
        }
        setFollowing(followNum);
    }, [props.follow, props.vacation.id]);

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

    //ONE
    function oneVacation() {
        let id = props.vacation.id;
        props.navOne("one", id);
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
    if (deleted === true) {
        props.nav("vacations");
    }

    //CANCEL
    function cancel() {
        props.nav("vacations");
    }

    if (edit === true) {
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
                            <div className="row">
                                <div className="col">
                                    <button id="cancel" className="btn btn-lg btn-danger btn-block form-control" onClick={cancel}>Cancel</button>
                                </div>
                                <div className="col">
                                    <button id="save" className="btn btn-lg btn-primary btn-block form-control" type="submit">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="col-md-4">
                <div className="card">
                    <img src={imageadress} className="card-img-top" onClick={oneVacation} alt={props.vacation.target}></img>
                    <div className="card-body">
                        <h6 className="card-title title" onClick={oneVacation}><b>{props.vacation.target}</b></h6>
                        <p className="description">{props.vacation.description}</p>
                        <p>{dated} - {datea} <b className="price">{props.vacation.price}₪</b></p>
                    </div>
                    <div className="card-footer">
                        <IconContext.Provider value={{ className: "soc" }}>
                            <TiSocialFacebook onClick={follow} /> <span className="soc2">{following} follower</span>
                        </IconContext.Provider>
                        {props.admin ? <IconContext.Provider value={{ className: "edit" }}>
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

function Vacations(props) {
    let role = props.role;
    const [vacations, setVacations] = useState([]);
    const [following, setFollowing] = useState();

    function fetchVacations() {
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
    }
    if (vacations.length === 0) {
        fetchVacations();
        fetchFollow();
    }
    function nav() {
        fetchVacations();
    }
    function navOne(navLink, id) {
        props.nav(navLink, id);
    }

    function fetchFollow() {
        fetch(`http://localhost:3200/follow`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                setFollowing(data);
            });
    }
    socket.on('follow', function (follow) {
        setFollowing(follow);
    });

    return (
        <div className="row">
            {vacations.map((vacation, i) => (
                <Vacation {...vacation} key={i} vacation={vacation} nav={nav} admin={role} navOne={navOne} user={props.user} follow={following} />
            ))}
        </div>
    );
}

function OneVacation(props) {
    const imageadress = `http://localhost:3200/uploads/${props.vacation.image}`;;

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

    //FOLLOW
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
                .then(vacationNew => {
                    vacationNew = JSON.parse(vacationNew);
                    if (vacationNew.status === 200) {
                        props.vacation.target = vacationNew.target;
                        props.vacation.description = vacationNew.description;
                        props.vacation.price = vacationNew.price;
                        props.vacation.date_departure = vacationNew.date_departure;
                        props.vacation.date_arrival = vacationNew.date_arrival;
                        props.vacation.image = vacationNew.image;
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
                .then(vacationNew => {
                    vacationNew = JSON.parse(vacationNew);
                    if (vacationNew.status === 200) {
                        props.vacation.target = vacationNew.target;
                        props.vacation.description = vacationNew.description;
                        props.vacation.price = vacationNew.price;
                        props.vacation.date_departure = vacationNew.date_departure;
                        props.vacation.date_arrival = vacationNew.date_arrival;
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
    if (deleted === true) {
        props.nav("vacations");
    }

    //BACK
    function back() {
        props.nav("vacations");
    }

    //CANCEL
    function cancel() {
        props.nav("one", props.vacation.id);
    }

    if (edit === true) {
        return (
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
                        <div className="row">
                            <div className="col">
                                <button id="cancel" className="btn btn-lg btn-danger btn-block form-control" onClick={cancel}>Cancel</button>
                            </div>
                            <div className="col">
                                <button id="save" className="btn btn-lg btn-primary btn-block form-control" type="submit">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <div className="card">
                <img src={imageadress} className="big-image" alt={props.vacation.target}></img>
                <div className="card-body">
                    <h6 className="card-title title2"><b>{props.vacation.target}</b></h6>
                    <p>{props.vacation.description}</p>
                    <p>{dated} - {datea} <b className="price">{props.vacation.price}₪</b></p>
                </div>
                <div className="card-footer">
                    <IconContext.Provider value={{ className: "soc" }}>
                        <TiSocialFacebook onClick={follow} /> <span className="soc2">{props.vacation.follower} follower</span>
                    </IconContext.Provider>
                    {props.admin ? <IconContext.Provider value={{ className: "edit" }}>
                        <MdDelete onClick={deleteV} className="delete" />
                        <MdEdit onClick={editV} className="edit2" />
                    </IconContext.Provider>
                        : null}
                    <span className="back" onClick={back}>Back</span>
                </div>
            </div>
        )
    }
}

function AddVacation(props) {
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
        props.nav("vacations");
    }

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
                    <input onChange={getImage} name="image" id="image" type="file" className="btn btn-lg btn-outline-primary btn-block form-control" required></input>
                    <button id="register" className="btn btn-lg btn-primary btn-block form-control" type="submit">Add vacation</button>
                </form>
            </div>
        </div>
    )
}

function Report(props) {
    const data = {
        datasets: [
            {
                label: "Dataset 1",
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                lineTension: 0,
                borderDash: [8, 4],
                data: []
            }
        ]
    };
    const options = {
        scales: {
            xAxes: [
                {
                    type: "realtime",
                    realtime: {
                        onRefresh: function () {
                            data.datasets[0].data.push({
                                x: Date.now(),
                                y: Math.random() * 100
                            });
                        },
                        delay: 2000
                    }
                }
            ]
        }
    };
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });

    return (
        <div className="row">
            <canvas id="myChart" width="400" height="400"></canvas>
        </div>
    );
}

function Reports(props) {
    const [following, setFollowing] = useState();
    fetch(`http://localhost:3200/follow`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                setFollowing(data);
            });
    socket.on('follow', function (follow) {
        setFollowing(follow);
    });

    return (
        <div className="row">
            <Report follow={following}/>
        </div>
    );
}

function Header(props) {
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

    function login() {
        props.nav("login");
    }
    function register() {
        props.nav("register");
    }
    function vacations() {
        props.nav("vacations");
    }
    function add() {
        props.nav("add");
    }
    function reports() {
        props.nav("reports");
    }
    function logout() {
        setLogged(false);
        setLoggedUser({});
        setAdmin(false);
        sessionStorage.removeItem('token');
        props.nav("login");
    }

    useEffect(() => {
        if (loggedUser.role === "admin") {
            setAdmin(true);
        }
    }, [loggedUser, logged]);

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    <div className="date">
                        <ul id="nav" className="list-group list-group-horizontal">
                            {logged ? null :
                                <>
                                    <li className="list-group-item">
                                        <span className="navlink" onClick={login}>Login</span>
                                    </li>
                                    <li className="list-group-item">
                                        <span className="navlink" onClick={register}>Register</span>
                                    </li>
                                </>
                            }
                            {logged ?
                                <>
                                    <li className="list-group-item">
                                        <span className="navlink" onClick={vacations}>Vacations</span>
                                    </li>
                                    {admin ?
                                        <>
                                            <li className="list-group-item">
                                                <span className="navlink" onClick={add}>Add vacation</span>
                                            </li>
                                            <li className="list-group-item">
                                                <span className="navlink" onClick={reports}>Reports</span>
                                            </li>
                                        </>
                                        : null}
                                    <li className="list-group-item">
                                        <span className="navlink" onClick={logout}>Logout</span>
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
    const [logged, setLogged] = useState(false);
    const [loggedUser, setLoggedUser] = useState({});
    const [showLogin, setShowLogin] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showVacations, setShowVacations] = useState(false);
    const [showOneVacation, setShowOneVacation] = useState(false);
    const [showAddVacation, setShowAddVacation] = useState(false);
    const [showReports, setShowReports] = useState(false);
    const [role, setRrole] = useState(false);
    const [vacation, setVacation] = useState({});

    function nav(navlink, id) {
        if (id !== undefined) {
            fetch(`http://localhost:3200/vacations/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
                .then(res => res.json())
                .then(data => {
                    setVacation(data);
                });
        }
        switch (navlink) {
            case "login":
                setShowLogin(true);
                setShowRegister(false);
                setShowVacations(false);
                setShowOneVacation(false);
                setShowAddVacation(false);
                setShowReports(false);
                break;
            case "register":
                setShowLogin(false);
                setShowRegister(true);
                setShowVacations(false);
                setShowOneVacation(false);
                setShowAddVacation(false);
                setShowReports(false);
                break;
            case "vacations":
                setShowLogin(false);
                setShowRegister(false);
                setShowVacations(true);
                setShowOneVacation(false);
                setShowAddVacation(false);
                setShowReports(false);
                break;
            case "one":
                setTimeout(function () {
                    setShowLogin(false);
                    setShowRegister(false);
                    setShowVacations(false);
                    setShowOneVacation(true);
                    setShowAddVacation(false);
                    setShowReports(false);
                }, 200);
                break;
            case "add":
                setShowLogin(false);
                setShowRegister(false);
                setShowVacations(false);
                setShowOneVacation(false);
                setShowAddVacation(true);
                setShowReports(false);
                break;
            case "reports":
                setShowLogin(false);
                setShowRegister(false);
                setShowVacations(false);
                setShowOneVacation(false);
                setShowAddVacation(false);
                setShowReports(true);
                break;
            default:
                setShowLogin(true);
                setShowRegister(false);
                setShowVacations(false);
                setShowOneVacation(false);
                setShowAddVacation(false);
                setShowReports(false);
                break;
        }
    }

    function logging(loggedUser, logged) {
        setLogged(logged);
        setLoggedUser(loggedUser);
        if (loggedUser.role === "admin") {
            setRrole(true);
        } else {
            setRrole(false);
        }
    }

    useEffect(() => {
        setTimeout(function () {
            container.dispatch({
                type: ACTIONS.LOGGED,
                logged: logged,
                user: loggedUser
            });
        }, 200);
    }, [loggedUser, logged]);

    return (
        <div className="container">
            <div className="row">
                <Header nav={nav} />
            </div>
            {showLogin ? <Login nav={nav} logging={logging} /> : null}
            {showRegister ? <Register nav={nav} /> : null}
            {showVacations ? <Vacations nav={nav} role={role} user={loggedUser} /> : null}
            {showOneVacation ? <OneVacation nav={nav} vacation={vacation} admin={role} user={loggedUser} /> : null}
            {showAddVacation ? <AddVacation nav={nav} /> : null}
            {showReports ? <Reports nav={nav} /> : null}
        </div>
    );
}

export default App;