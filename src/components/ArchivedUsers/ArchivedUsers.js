import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { flexbox } from '@material-ui/system';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const MyCard = styled(Card)({
    background: '#d2d2d4',
    border: 0,
    borderRadius: 3,
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    // // color: 'white',
    height: "70%",
    width: "47%",
    padding: 10,
    margin: 5,
    fontSize: 16,
    display: flexbox,
    fontFamily: 'PT Sans Narrow'
});

class ArchivedUsers extends Component {

    state = {
        listUser: [],
        deleteOpen: false,
        rctvOpen: false
    }

    componentDidMount() {
        this.listUsers();
    }

    listUsers = () => {
        axios.get('/api/admin').then((response) => {
            console.log("grabbing user list:", response.data)
            this.setState({...this.state,
                listUser: response.data
            })
        })
    }

    permanentlyDeleteUser = (id) => {
        this.props.dispatch({ type: 'DELETE_USER', payload: id });
        this.listUsers();
        this.handleDeleteClose();
    }

    handleDeleteOpen = (userid) => {
        this.setState({
            ...this.state,
            deleteOpen: true,
            userToDelete: userid
        })
    };

    handleDeleteClose = () => {
        this.setState({
            ...this.state,
            deleteOpen: false
        })
    };

   
    handleRctvClose = () => {
        this.setState({
            ...this.state,
            rctvOpen: false
        })
    };

    handleRctvOpen = (userid) => {
        this.setState({
            ...this.state,
            rctvOpen: true,
            userToRctv: userid
        })
    };


    permanentlyRctvUser = (id) => {
        this.props.dispatch({ type: 'REACTIVATE_USER', payload: id });
        this.listUsers();
        this.handleRctvClose();
    }

    render() {
        return (
            <div>
                 <div className="archived-users-wrapper">
                        {this.state.listUser.map((user) => {
                            if (user.active === false) { 
                                if (user.name === null) {
                                    return (
                                        <MyCard>
                                            <div key={user.id}>
                                                <h5 className="styled-h5">Name:</h5> {user.username} <br />
                                                <h5 className="styled-h5">DOB:</h5> {user.age}<br />
                                                <h5 className="styled-h5">Phone:</h5> {user.phone}<br />
                                                <button className="archived-btns" onClick={() => this.handleRctvOpen(user.id)}>REACTIVATE</button>
                                                <button className="archived-btns" onClick={() => this.handleDeleteOpen(user.id)}>PERMANENTLY DELETE</button>
                                            </div>
                                        </MyCard>)
                                }
                                else {
                                return (
                                    <MyCard>
                                    <div key={user.id}>
                                    <h5 className="styled-h5">Name:</h5> {user.name} <br/>
                                        <h5 className="styled-h5">DOB:</h5> {user.age}<br/>
                                        <h5 className="styled-h5">Phone:</h5> {user.phone}<br/>
                                            <button className="archived-btns" onClick={() => this.handleRctvOpen(user.id)}>REACTIVATE</button>
                                            <button className="archived-btns" onClick={() => this.handleDeleteOpen(user.id)}>PERMANENTLY DELETE</button>
                                    </div>
                                    </MyCard>)
                                }
                            }
                        })}

                    <Dialog open={this.state.rctvOpen} onClose={this.rctvClose}>
                        <DialogTitle id="form-dialog-title"><h3>Are you sure you want to RCTV user?</h3></DialogTitle>
                        <DialogActions>
                            <button onClick={this.handleRctvClose}>
                                CANCEL
                                        </button>
                            <button onClick={(e) => this.permanentlyRctvUser(this.state.userToRctv)}>
                                YES
                                        </button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.deleteOpen} onClose={this.deleteClose}>
                        <DialogTitle id="form-dialog-title"><h3>Are you sure you want to permanently delete this user?</h3></DialogTitle>
                        <DialogActions>
                            <button onClick={this.handleDeleteClose}>
                                CANCEL
                                        </button>
                            <button onClick={(e) => this.permanentlyDeleteUser(this.state.userToDelete)}>
                                YES
                                        </button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(ArchivedUsers);