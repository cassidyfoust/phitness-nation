import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert';

class AddExercise extends Component {

    state = {
        exerciseName: '',
        weight: '', 
        set: '',
        frequency: '',
        units: 'reps',
        link: ''
    }

    //POST request to add new exercise into database
    AddExercise = () => {
        axios.post('/api/admin/addExercise', this.state).then(() => {
            this.setState ({
                exercise: '',
                weight: '', 
                set: '',
                frequency: '',
                units: 'reps',
                link: ''
            })
            swal("Saved!", "Added Exercise to library", "success");
            this.props.history.push('/admin')
        }).catch((error) => {
            console.log('Error adding exercise', error)
        });
    }

    //Storing value typed from input field to local state
    inputValueChange = (event, propertyName) => {
        this.setState({
            [propertyName]: event.target.value
        })
    }

    

    render() {

        return (
            <div>
                  <h1>add exercise page</h1>
                <input onChange = {(event) => this.inputValueChange(event, 'exerciseName')}placeholder="Exercise Name"></input>
                <input onChange = {(event) => this.inputValueChange(event, 'weight')}placeholder="Weight"></input>
                <input onChange = {(event) => this.inputValueChange(event, 'set')}placeholder="Set"></input>
                <input onChange = {(event) => this.inputValueChange(event, 'frequency')}placeholder="frequency"></input>
                <select onChange = {(event) => this.inputValueChange(event, 'units')}>
                    <option value="reps">reps</option>
                    <option value="sec">sec</option>
                    <option value="min">min</option>
                </select>
                <input onChange = {(event) => this.inputValueChange(event, 'link')} placeholder = "link"/>
                <button onClick = {() => this.AddExercise()}>Add Exercise</button>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(AddExercise);