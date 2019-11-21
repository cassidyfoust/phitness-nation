import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import SelectDrop from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';

const MyTextField = styled(TextField)({
    padding: 10,
    margin: 5,
    textAlign: "center"
});

const MySelectDrop = styled(SelectDrop)({
    width: 200,
    margin: 10
})

const MyCard = styled(Card)({
    padding: 5,
    margin: 5,
    textAlign: "center",
    height: 80,
    backgroundColor: '#d2d2d4'
})

class AdminAddWorkout extends Component {
    state = {
        user_id: this.props.match.params.id,
        week: 1,
        maxWeek: 1,
        //exercise_id, assigned_reps, assigned_sets, assigned_weight, tips
        exercises: [

        ],
        email: false,
        injuries: [

        ],
        listExercises: [  

        ],
        tempExercise: {
            exercise_id: 0,
            assigned_reps: '',
            assigned_sets: '',
            assigned_weight: '',
            tips: ''
        }
    }
    componentDidMount = () =>{
        this.getExercises();
        this.getWeeks();
        this.injuryDisplay();
    }

    injuryDisplay = () => {
        this.props.dispatch({ type: 'FETCH_INJURIES'})
    }

    getExercises = () =>{
        this.props.dispatch({ type: 'FETCH_EXERCISES', payload: {active: true}})
        setTimeout(() =>{
            this.props.reduxState.exerciseWorkouts.exerciseReducer.map((exercise) =>{
                this.setState({
                    listExercises: [...this.state.listExercises, {value: exercise.id, label: exercise.name }]
                })
            })
        }, 1000)
    }
    getWeeks = () =>{
        this.props.dispatch({ type: 'FETCH_WEEKS', payload: {id: this.state.user_id}})
        setTimeout(() =>{
            if(this.props.reduxState.exerciseWorkouts.weeksReducer.length > 0){
            let weekLength = this.props.reduxState.exerciseWorkouts.weeksReducer.length - 1
            this.setState({ maxWeek: (this.props.reduxState.exerciseWorkouts.weeksReducer[weekLength].week + 1)})
            this.setState({ week: (this.props.reduxState.exerciseWorkouts.weeksReducer[0].week)})
            }
        }, 1000)
    }
    handleSelectChange = (value) => {
        if(value != null){
            this.setState({
                tempExercise: {...this.state.tempExercise, exercise_id: value.value }
            })
        }else{
            this.setState({
                tempExercise: {...this.state.tempExercise, exercise_id: 0 }
            })
        }
        console.log(this.state.tempExercise.exercise_id)
      };
    
    handleCreate = (exerciseName) => {
        this.props.dispatch({type: 'ADD_EXERCISE', payload: {name: exerciseName}})
        setTimeout(() =>{
            this.setState({ listExercises: []})
            this.props.reduxState.exerciseWorkouts.exerciseReducer.map((exercise) =>{
                this.setState({
                    listExercises: [...this.state.listExercises, {value: exercise.id, label: exercise.name }]
                })
            })
        }, 1000)
    }

    handleChange = (event, propertyName) =>{
        this.setState({ tempExercise: { ...this.state.tempExercise, [propertyName]: event.target.value }})
    }
    addExercise = () =>{
        this.setState({ exercises: [
            ...this.state.exercises, {
                exercise_id: this.state.tempExercise.exercise_id,
                assigned_reps: this.state.tempExercise.assigned_reps,
                assigned_sets: this.state.tempExercise.assigned_sets,
                assigned_weight: this.state.tempExercise.assigned_weight,
                tips: this.state.tempExercise.tips
            }
        ]})
        this.setState({ tempExercise: {
            exercise_id: '',
            assigned_reps: '',
            assigned_sets: '',
            assigned_weight: '',
            tips: ''
        }})
    }
    emailToggle = () =>{
        this.setState({ email: !this.state.email })
    }
    setWeek = (event) =>{
        this.setState({ week: event.target.value })
    }

    addWorkout = () => {
        const newWorkout = {
            user_id: this.state.user_id,
            week: this.state.week,
            exercises: this.state.exercises,
            email: this.state.email
        }
        this.props.dispatch({ type: 'POST_WORKOUTS', payload: newWorkout })
        this.props.history.push('/adminviewuser/' + this.state.user_id)
    }

    magicButton = () => {
        this.setState ({
            tempExercise: {
                exercise_id: 1,
                assigned_reps: 3,
                assigned_sets: 10,
                assigned_weight: 50,
                tips: 'Keep your back neutral, core tight, and engage hamstrings'
            }
        })
    }

    magicButton2 = () => {
        this.setState ({
            tempExercise: {
                exercise_id: 7,
                assigned_reps: 3,
                assigned_sets: 15,
                assigned_weight: 40,
                tips: 'Dont go too fast'
            }
        })
    }
    magicButton3 = () => {
        this.setState({
            tempExercise: {
                exercise_id: 6,
                assigned_reps: 4,
                assigned_sets: 20,
                assigned_weight: 10,
                tips: 'Keep your back neutral, core tight, and engage hamstrings'
            }
        })
    }
    magicButton4 = () => {
        this.setState({
            tempExercise: {
                exercise_id: 2,
                assigned_reps: 3,
                assigned_sets: 15,
                assigned_weight: 45,
                tips: 'Engage the glutes, feel the burn'
            }
        })
    }

    render() {
        return (
            <div className="admin-add-workout">
                <h3 onClick={() => this.magicButton()}>Add Exercises to Workout:</h3> 
                <center><h20 onClick={() => this.magicButton2()}> - </h20><h20 onClick={() => this.magicButton3()}> - </h20><h20 onClick={() => this.magicButton4()}> - </h20><br></br></center>


                
            {/* {JSON.stringify(this.state)} */}
            {/* {JSON.stringify(this.props.reduxState.injuries.injuriesReducer)} */}
            <CreatableSelect
                isClearable
                onChange={this.handleSelectChange}
                onCreateOption ={this.handleCreate}
                options={this.state.listExercises}
                />

            <MyTextField
                label="Sets"
                value={this.state.tempExercise.assigned_sets}
                onChange={(event) => this.handleChange(event, 'assigned_sets')}
                margin="normal"
            />
            <MyTextField
                label="Reps"
                value={this.state.tempExercise.assigned_reps}
                onChange={(event) => this.handleChange(event, 'assigned_reps')}
                margin="normal"
            />
            <MyTextField
                label="Weight"
                value={this.state.tempExercise.assigned_weight}
                onChange={(event) => this.handleChange(event, 'assigned_weight')}
                margin="normal"
            />
            <MyTextField
                multiline={true}
                rows={2}
                rowsMax={4}
                fullWidth
                label="Tips"
                value={this.state.tempExercise.tips}
                onChange={(event) => this.handleChange(event, 'tips')}
                margin="normal"
            />
            <div className="add-exercise-workout-btn">
            <button
                onClick = {this.addExercise}>
                ADD EXERCISE
            </button>
                </div>
            <br/>

            <h3 onClick = {() => this.magicButton2()}>Exercises:</h3>
            <ul>
            {this.state.exercises.map(exercise =>{
                let exerciseName;
                for(let i = 0; i<this.state.listExercises.length; i++){
                    if(this.state.listExercises[i].value === exercise.exercise_id){
                        exerciseName = this.state.listExercises[i].label
                    }
                }
                return(
                    <li>{exerciseName}</li>
                )
            })}
            </ul>
            <br></br>
                <div className="add-exercise-workout-btn">
            <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                Week
                </InputLabel>
                <MySelectDrop
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.week}
                onChange={this.setWeek}
                >
                {this.props.reduxState.exerciseWorkouts.weeksReducer.map((week, index)=>{
                    return(
                        <MenuItem value = {week.week}>Week {week.week}</MenuItem>
                    )
                })}
                <MenuItem value = {this.state.maxWeek}>Create New: Week {this.state.maxWeek}</MenuItem>
                </MySelectDrop>
            </FormControl>
            </div>
            <div className="add-exercise-workout-btn">
                    <FormControlLabel

                        control={
                            <Checkbox
                                color="default"
                                checked={this.state.email}
                                onChange={this.emailToggle}
                                value={false}
                            />}
                        label="Email Client?"
                        labelPlacement="end"
                    />
            <button
                onClick = {this.addWorkout}>
                ADD WORKOUT
            </button>
                </div>
                <h3>User Injuries:</h3>
                {this.props.reduxState.injuries.injuriesReducer.map((injury) => {
                    let severity = ""
                    if (injury.severity == 1) {
                        severity = "Mild"
                    }
                    else if (injury.severity == 2) {
                        severity = "Moderate"
                    }
                    else if (injury.severity == 3) {
                        severity = "Severe"
                    }
                    else if (injury.severity == 0) {
                        severity = "Healed"
                    }
                    return (
                        <>
                            <MyCard>
                                <p>Type: {injury.type}<br></br>
                                    Description: {injury.description}<br></br>
                                    Severity: {severity}</p>
                            </MyCard>
                        </>
                    )
                })}
            </div>
        )
    }
}
const mapStateToProps = reduxState => ({
    reduxState,
});

export default connect(mapStateToProps)(AdminAddWorkout);