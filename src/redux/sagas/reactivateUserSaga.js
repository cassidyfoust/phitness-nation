import axios from 'axios';
import { takeEvery } from 'redux-saga/effects';

// worker Saga: will be fired on "REACTIVATE_USER" actions
function* editrctv(action) {
    try {
        console.log(action.payload);

        yield axios.put(`/api/admin/reactivate/${action.payload}`, action.payload)
    } catch (error) {
        console.log('UPDATE EXERCISE WORKOUTS ERROR')
    }
}

function* reactivateUserSaga() {
    yield takeEvery('REACTIVATE_USER', editrctv);
}

export default reactivateUserSaga;