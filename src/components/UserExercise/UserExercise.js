import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { flexbox } from '@material-ui/system';
import Slider from '@material-ui/core/Slider';
import { ProgressBar } from 'react-bootstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';

const MySlider = styled(Slider)({
    color: '#3d6363',
})

const MyCard = styled(Card)({
    background: '#d2d2d4',
    border: 0,
    borderRadius: 3,
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    // // color: 'white',
    // height: 60,
    width: "100%",
    padding: 15,
    margin: 5,
    fontSize: 24,
    display: flexbox,
    textAlign: "center",
});


class UserExercise extends Component {

    state = {
        exerciseId: 0,
        workoutId: 0,
        exerciseOrder: 0,
        weightAchieved: 0,
        repsAchieved: 0,
        setsAchieved: 0,
        feedbackOpen: false,
        feedback: 0
    }

    handleClickOpen = () => {
        this.setState({
            ...this.state,
            feedbackOpen: true})
    };

    handleClose = () => {
        this.setState({
            ...this.state,
            feedbackOpen: false
        })
    };

    handleRadioChange = (event) => {
        this.setState({
            ...this.state,
            feedback: parseInt(event.target.value)
        })
        console.log('the feedback is:', event.target.value)
    }

    handleSubmit = () => {
        console.log('submitting the following data:', this.state)
        // props.dispatch({ type: 'POST_GOAL', payload: values });
        this.handleClose()
    }

    handleWeightChange = (name, value) => {
        let newWeight = parseInt(value.target.innerText)
        this.setState({ ...this.state, [name]: newWeight});
    };

    handleRepsChange = (name, value) => {
        let newReps = parseInt(value.target.innerText)
        this.setState({ ...this.state, [name]: newReps });
    };

    handleSetsChange = (name, value) => {
        let newSets = parseInt(value.target.innerText)
        this.setState({ ...this.state, [name]: newSets });
    };

    handleClick = (props) => {
        this.props.history.push(`/exercise/${this.state.workoutId}-${this.state.exerciseId + 1}-${this.state.exerciseOrder + 1}`);
        this.setState({...this.state,
            exerciseId: this.state.exerciseId += 1,
            workoutId: this.state.workoutId,
            exerciseOrder: this.state.exerciseOrder +=1
        })
    }

    handleBack = (props) => {
            if (this.state.exerciseOrder == 1) {
                this.props.history.push(`/preview/${this.state.workoutId}`)
            }
            else {
                this.props.history.push(`/exercise/${this.state.workoutId}-${this.state.exerciseId - 1}-${this.state.exerciseOrder - 1}`)
            }
        this.setState({...this.state,
            exerciseId: this.state.exerciseId -= 1,
            workoutId: this.state.workoutId,
            exerciseOrder: this.state.exerciseOrder -= 1
        })
    }

    componentDidMount = () => {
        let workoutExerciseIds = this.props.match.params.id.split('-')
        let workoutId = parseInt(workoutExerciseIds[0])
        let exerciseId = parseInt(workoutExerciseIds[1])
        let exerciseOrder = parseInt(workoutExerciseIds[2])
        this.setState({...this.state,
            exerciseId: exerciseId,
            workoutId: workoutId,
            exerciseOrder: exerciseOrder
        })
        this.props.dispatch({ type: 'FETCH_EXERCISE_WORKOUTS', payload: workoutId })
    }

    render() {
        return (
            <div className="exercise-page">
                {this.props.reduxState.exerciseWorkouts.exerciseWorkoutReducer.map((exercise) => {
                    if (exercise.id == this.state.exerciseId)
                    return (<>
                    <MyCard>
                            <h1>{exercise.name}</h1>
                                <h5>Weight: {exercise.assigned_weight} |
                                Reps / Duration: {exercise.assigned_reps} |
                                Sets: {exercise.assigned_sets}</h5>
                    < h3 > Instructor Notes:</h3 > {exercise.tips}
                    </MyCard>
                    <div className="exercise-feedback">
                    <h2>How did you do?</h2>
                        Weight: <MySlider
                            defaultValue={exercise.assigned_weight}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={((exercise.assigned_weight)/5)}
                            marks
                            min={0}
                            max={(exercise.assigned_weight*1.5)}
                            onChange={(value) => this.handleWeightChange('weightAchieved', value)}
                            // valueLabelDisplay="on"
                        />
                        Reps / Duration: <MySlider
                            defaultValue={exercise.assigned_reps}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={(exercise.assigned_reps * 1.5)}
                            onChange={(value) => this.handleRepsChange('repsAchieved', value)}
                        // valueLabelDisplay="on"
                        />
                        Sets: <MySlider
                            defaultValue={exercise.assigned_sets}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={(exercise.assigned_sets * 1.5)}
                                onChange={(value) => this.handleSetsChange('setsAchieved', value)}
                        // valueLabelDisplay="on"
                        />
                        </div>
            <div className="exercise-buttons-wrapper">
            <button onClick={(props) => this.handleBack(props)}>BACK</button>
            <button onClick={this.handleClickOpen}>NEXT</button>
                <Dialog open={this.state.feedbackOpen} onClose={this.handleClose}>
                                <DialogTitle id="form-dialog-title">How did this exercise feel?</DialogTitle>
                                <DialogContent>
                                    <Radio
                                        checked={this.state.feedback === 1}
                                        onChange={this.handleRadioChange}
                                        value="1"
                                        color="default"
                                        name="radio-button-demo"
                                        label="1"
                                        labelPlacement="bottom"
                                    />
                                    <label>1</label>
                                    <Radio
                                        checked={this.state.feedback === 2}
                                        onChange={this.handleRadioChange}
                                        value="2"
                                        color="default"
                                        name="radio-button-demo"
                                    />
                                    <label>2</label>
                                    <Radio
                                        checked={this.state.feedback === 3}
                                        onChange={this.handleRadioChange}
                                        value="3"
                                        color="default"
                                        name="radio-button-demo"
                                    />
                                    <label>3</label>
                                    <Radio
                                        checked={this.state.feedback === 4}
                                        onChange={this.handleRadioChange}
                                        value="4"
                                        color="default"
                                        name="radio-button-demo"
                                    />
                                    <label>4</label>
                                    <Radio
                                        checked={this.state.feedback === 5}
                                        onChange={this.handleRadioChange}
                                        value="5"
                                        color="default"
                                        name="radio-button-demo"
                                    />
                                    <label>5</label>
                                </DialogContent>
                                <DialogActions>
                                    <button onClick={this.handleClose}>
                                        CANCEL
                                        </button>
                                    <button onClick={this.handleSubmit}>
                                        SAVE
                                        </button>
                                </DialogActions>
                            </Dialog>
            </div>
                        <ProgressBar now={((this.state.exerciseOrder-1) / (this.props.reduxState.exerciseWorkouts.exerciseWorkoutReducer.length)*100)} />
                        <p>{(this.state.exerciseOrder-1)} out of {this.props.reduxState.exerciseWorkouts.exerciseWorkoutReducer.length} exercises complete!</p>
                </>
                    )
                })}
            </div>
        );
    }
}

const mapStateToProps = reduxState => ({
    reduxState,
});

export default connect(mapStateToProps)(UserExercise);