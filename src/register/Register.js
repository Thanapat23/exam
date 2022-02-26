import React, { Component } from "react";
import axios from "axios";
import { ip, port } from "../setIP/setting";
import { useHistory } from 'react-router-dom';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idkey: "",
            firstname: "",
            email: localStorage.getItem('email'),
            lastname: "",
            district: "",
            data: []
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        console.log(e.target.id);
        console.log(e.target.value);
    }
    handleClicked() {
        let url = `https://localhost:3000/data`;
        let data = {
            idkey: this.state.idkey,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            district: this.state.district,
            email: this.state.email
        }
        axios.post(url, data)
        this.setState({
            idkey: "",
            firstname: "",
            lastname: "",
            district: "",
            email: ""
        });
        setTimeout(() => {
            this.props.history.push('./Showdata'); 
        }, 100);    
    }

    componentDidMount() {
        //console.log("before get data");
        this.getData();
        //console.log("after get data");
    }
    getData = () => {
        console.log("before fetch data");
        fetch('/cmdistrict')
            .then(res => res.json())
            .then(list => this.setState({ data: list }))
        console.log("after fetch data");
    }


    render() {
        return (
            <div>
                <div className="App">
                    <h2 className="my-4">Register<br /></h2>
                    <hr />
                </div>
                <form className="container">
                    <div className="form-group">
                        <label className="text-white" htmlFor="id">ID</label>
                        <input type="text" className="form-control" size="10" id="idkey" onChange={this.handleChang} value={this.state.idkey} />
                    </div>
                    <div className="form-group">
                        <label className="text-white" >First Name</label>
                        <input type="text" className="form-control" id="firstname" onChange={this.handleChang} value={this.state.firstname} />
                    </div>
                    <div className="form-group">
                        <label className="text-white"  >Last Name</label>
                        <input type="text" className="form-control" id="lastname" onChange={this.handleChang} value={this.state.lastname} />
                    </div>
                    <div>
                        <select className="form-group" id="district" value={this.state.district} onChange={this.handleChang} required>
                            <option value="">Select District CNX</option>
                            {this.state.data.map(user => {
                                return <option value={user.id}>{user.district_name}</option>
                            })}
                        </select>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Submit</button>
                </form>
            </div>
        );
    }
}

export default function WithRouter(props) {
    const history = useHistory();
    return (<Register {...props} history={history} />);
}
