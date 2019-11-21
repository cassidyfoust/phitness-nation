import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { styled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = {
    palette: {
        backgroundColor: "teal",
        color: "white",
        marginLeft: 50,
    },
    fab: {
        width: "100%",
        position: "fixed",
        bottom: "0",
        height: "21%",
        left: "0%",
        size: "large"

    },
    add: {
        color: "white",
        fontSize: "large"
    }
};
const MyTextField = styled(TextField)({
    padding: 10,
    margin: 5,
    textAlign: "center",
    fontFamily: 'PT Sans Narrow',
  });
class AdminExerciseList extends Component {

    state = {
        listExercises: [],
        newExerciseOpen: false,
        newExerciseName: '',
        newExerciseDescription: '',
        exerciseDescriptionOpen: false,
        exerciseDetails: {},
        editModal: false,
        updateName: '',
        updateDescription: '',
        filterValue: '',
        tempExercise: {
            updateName: '',
            newExerciseDescription:  ''
    
        }
    }
    magicButton = () => {
        console.log('yay');
        
        this.setState({
            tempExercise: {
                updateName: 'Concentration Curls',
                newExerciseDescription: 'Dumbbell or similar weighted object is held in the hand with the arm extended and lifted to complete flexion of the arm at the elbow'
            }
        })
    }
    handleChange = (event) => {
        this.setState({...this.state,
            newExerciseName: event.target.value,
        });
    }

    handleUpdateName = (event) => {
        this.setState({
            ...this.state,
            updateName: event.target.value
        })
    }

    handleUpdateDescription = (event) => {
        this.setState({
            ...this.state,
            updateDescription: event.target.value
        })
    }

    componentDidMount() {
        this.listExercises();
    }


    exerciseDescription = (exercise) => {
                this.props.history.push(`/exerciseDetail/${exercise.id}`)
            }

    handleNewExerciseOpen = () => {
        this.setState({
            ...this.state,
            newExerciseOpen: true
        })
    }

    handleNewExerciseClose = () => {
        this.setState({
            ...this.state,
            newExerciseOpen: false
        })
    }

    handleExerciseDescriptionOpen = (exercise) => {
        this.setState({
            ...this.state,
            exerciseDescriptionOpen: true,
            exerciseDetails: exercise
        })
    }

    handleExerciseDescriptionClose = () => {
        this.setState({
            ...this.state,
            exerciseDescriptionOpen: false
        })
    }

    setEditMode = () => {
        this.setState({
            ...this.state,
            editModal: true,
            updateName: this.state.exerciseDetails.name,
            updateDescription: this.state.exerciseDetails.links
        })
    }
    setEditModeFalse = () => {
        this.setState({
            ...this.state,
            editModal: false
        })
    }

    listExercises = () => {
        const active = true
        axios.get(`/api/admin/exercise/${active}`).then((response) => {
            this.setState({
                ...this.state,
                listExercises: response.data
            })
        })
    }

    handleSubmit = () => {
        this.props.dispatch({ type:'ADD_EXERCISE', payload: {name: this.state.newExerciseName, description: this.state.newExerciseDescription}});
        this.setState({
            ...this.state,
            newExerciseOpen: false
        });
        this.listExercises()
    }

    addDescriptionChange = (event) => {
        this.setState({
            ...this.state,
            newExerciseDescription: event.target.value,
        });
    }

    saveChanges = (idIn) => {
        // console.log('the new name is:', this.state.updateName, this.state.updateDescription)
        this.props.dispatch({type: 'EDIT_EXERCISE', payload: {id: idIn, name: this.state.updateName, links: this.state.updateDescription}})
        this.setState({
            ...this.state,
            editModal: false,
            exerciseDescriptionOpen: false
        });
        this.listExercises()
    }

    archiveExercise = (exercise, archive) => {
        const active = { active: archive };
        axios.put(`/api/admin/exerciseArchive/${exercise.id}`, active).then((response) => {
            swal("Updated!", "Archiving Exercise Complete");
            this.listExercises();
        }).catch((err) => {
            console.log('error when archiving exercise', err)
        })
    }
    setFilter = (event) =>{
        this.setState({ filterValue: event.target.value})
    }
    render() {
        let editModal;
       if (this.state.editModal == false) {
           editModal = <><DialogContent>
               <h4 className="edit-ex-modal">Exercise Name:</h4>
               {this.state.exerciseDetails.name}
               <br></br>
               <br></br>
                <h4 className="edit-ex-modal">Description / Links: </h4>
                {this.state.exerciseDetails.links}
            </DialogContent>
            <DialogActions>
                <button onClick={this.handleExerciseDescriptionClose}>
                    CLOSE
                            </button>
                <button onClick={this.setEditMode}>
                    EDIT
                        </button>
            </DialogActions>
            </>
       } else {
           editModal = <>
               <DialogContent className="edit-exercise-modal" ><h4 className="edit-ex-modal">Exercise Name: </h4>
                    <input className="editExerciseInput" 
                    onChange={this.handleUpdateName}
                    placeholder={this.state.exerciseDetails.name}></input>
                   <br></br>
                   <h4 className="edit-ex-modal">Description / Links: </h4>
                   <textarea className="editExerciseInput" 
                    onChange={this.handleUpdateDescription}
                   placeholder={this.state.exerciseDetails.links}></textarea>
               </DialogContent>
               <DialogActions>
                   <button onClick={this.setEditModeFalse}>
                       CANCEL
                            </button>
                   <button onClick={(event) => this.saveChanges(this.state.exerciseDetails.id)}>
                       SAVE CHANGES
                        </button>
               </DialogActions>
           </>
       }

        return (
            <div className="admin-exercise-wrapper">
                <h4>Click the exercise to see details.</h4>
                <div>
                    <div style = {{display: 'inline'}}>
                        <MyTextField
                            label="Search Exercises"
                            value={this.state.filterValue}
                            onChange={this.setFilter}
                            margin="normal"
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <SearchIcon />
                                </InputAdornment>
                            ),
                            }}
                        />
                        <Fab style={styles.palette} aria-label="Add" onClick={() => this.handleNewExerciseOpen()}>
                            <AddIcon color={styles.palette.color} size="large" />
                        </Fab>
                    </div>
                <table className="admin-exercises">
                    <tbody>
                        {this.state.listExercises.map((exercise) => {
                            if(exercise.name.indexOf(this.state.filterValue) > -1){
                                return (
                                    <>
                                    <tr key={exercise.id} className="admin-exercises-tr">
                                        <td className="admin-exercises-td" onClick={() => this.handleExerciseDescriptionOpen(exercise)}>{exercise.name}</td>
                                        <td className="admin-exercises-td">
                                            <button className="archive-exercise" onClick={() => this.archiveExercise(exercise, false)}>ARCHIVE</button>
                                        </td>
                                    </tr>
                                    </>
                                );
                            }else if(this.state.filterValue === ''){
                                return (
                                    <>
                                    <tr key={exercise.id} className="admin-exercises-tr">
                                        <td className="admin-exercises-td" onClick={() => this.handleExerciseDescriptionOpen(exercise)}>{exercise.name}</td>
                                        <td className="admin-exercises-td">
                                            <button className="archive-exercise" onClick={() => this.archiveExercise(exercise, false)}>ARCHIVE</button>
                                        </td>
                                    </tr>
                                    </>
                                );
                            }
                        })}
                    </tbody>
                </table>
                <div className="add-exercise-wrapper">
                </div>
                <Dialog open={this.state.newExerciseOpen} onClose={this.handleNewExerciseClose}>
                    <DialogTitle id="form-dialog-title"><h3 onClick={()=>this.magicButton()}>Add New Exercise:</h3></DialogTitle>
                    <DialogContent>
                            New exercise name:<input className="newUserInput" onChange={this.handleChange}></input>
                            Description / links: <textarea className="editExerciseInput" onChange={this.addDescriptionChange} rows="4"></textarea>
                    </DialogContent>
                    <DialogActions>
                            <button onClick={this.handleNewExerciseClose}>
                                CANCEL
                                        </button>
                            <button onClick={this.handleSubmit}>
                                ADD EXERCISE
                                        </button>
                        </DialogActions>
                </Dialog>
                <Dialog className="edit-exercise-modal" open={this.state.exerciseDescriptionOpen} onClose={this.handleExerciseDescriptionClose}>
                    {editModal}
                </Dialog>
            </div>
        </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
});

export default withRouter(connect(mapStateToProps)(AdminExerciseList));