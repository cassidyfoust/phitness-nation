import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { flexbox } from '@material-ui/system';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CreatableSelect from 'react-select/creatable';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const MyCard = styled(Card)({
    background: '#d2d2d4',
    border: 0,
    borderRadius: 3,
    width: "100%",
    padding: 10,
    margin: 5,
    fontSize: 100,
    display: flexbox,
    textAlign: "left",
});
const MyTextField = styled(TextField)({
    padding: 10,
    margin: 5,
    textAlign: "center"
});
class AddExerciseToWorkout extends Component {
    state = {
        open: false,
        listExercises: [  

        ],
        exercise_id: 0,
        assigned_sets: '',
        assigned_reps: '',
        assigned_weight: '',
        tips: '',
        order: 1

    }
    componentDidMount = () =>{
        this.getExercises();
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
        this.setState({ [propertyName]: event.target.value })
    }
    handleSelectChange = (value) => {
        if(value != null){
            this.setState({
                exercise_id: value.value
            })
        }else{
            this.setState({
                exercise_id: 0 
            })
        }
      };
    setOpen = () =>{
        this.setState({ open: true })
    }
    setClose = () =>{
        this.setState({ open: false })
    }
    handleSubmit = () =>{
        this.props.dispatch({
            type: 'POST_EXERCISE_WORKOUTS', 
            payload: {
                user_id: this.props.userId,
                exercise:{
                    workout_id: this.props.workout_id, 
                    exercise_id: this.state.exercise_id,
                    assigned_reps: this.state.assigned_reps,
                    assigned_sets: this.state.assigned_sets,
                    assigned_weight: this.state.assigned_weight,
                    tips: this.state.tips,
                    order: this.state.order
                }
            }})
        this.setState({
            exercise_id: '',
            assigned_reps: '',
            assigned_sets: '',
            assigned_weight: '',
            tips: '',
            order: this.state.order +=1
        })
        this.setClose();
    }
    render() {
        return (
            <div>
                <Button onClick = {this.setOpen} variant="contained" >Add Exercise</Button>
                <Dialog
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.setClose}
                >
                    <DialogTitle id="form-dialog-title"><h5>Add Exercise to Workout:</h5></DialogTitle>
                    <DialogContent>
                        <CreatableSelect
                            isClearable
                            onChange={this.handleSelectChange}
                            onCreateOption ={this.handleCreate}
                            options={this.state.listExercises}
                        />
                        <MyTextField
                            label="Sets"
                            value={this.state.assigned_sets}
                            onChange={(event) => this.handleChange(event, 'assigned_sets')}
                            margin="normal"
                        />
                        <MyTextField
                            label="Reps"
                            value={this.state.assigned_reps}
                            onChange={(event) => this.handleChange(event, 'assigned_reps')}
                            margin="normal"
                        />
                        <MyTextField
                            label="Weight"
                            value={this.state.assigned_weight}
                            onChange={(event) => this.handleChange(event, 'assigned_weight')}
                            margin="normal"
                        />
                        <MyTextField
                            multiline={true}
                            rows={2}
                            rowsMax={4}
                            fullWidth
                            label="Tips"
                            value={this.state.tips}
                            onChange={(event) => this.handleChange(event, 'tips')}
                            margin="normal"
                        />
                        <br></br>
                        <button variant="contained" color="primary" onClick={this.handleSubmit}>
                            SAVE CHANGES
                        </button>
                        <button onClick = {this.setClose }>
                            CANCEL
                        </button>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}
const mapStateToProps = reduxState => ({
    reduxState,
});

export default connect(mapStateToProps)(AddExerciseToWorkout);