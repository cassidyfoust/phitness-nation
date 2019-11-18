const express = require('express');
// const { rejectUnauthenticated } = require('../modules/authentication-middleware');
// const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
// const userStrategy = require('../strategies/user.strategy');
const router = express.Router();

const nodemailer = require('nodemailer')

//Admin GET request to grab list of user from database to display on dashboard
router.get('/', (req, res) => {
    const queryText = `SELECT * FROM "user";`;
    pool.query(queryText).then((response) => {
        res.send(response.rows)
    }).catch((err) => {
        console.log('Error ---------> GETTING list of all Users', err);
        res.sendStatus(500);
    });
})
//Admin GET request to grab SELECTED user from database to display on dashboard

router.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const queryText = `SELECT * FROM "user" WHERE  "id" = $1;`;
    pool.query(queryText, [id]).then((response) => {
        res.send(response.rows[0])
    }).catch((err) => {
        console.log('Error ---------> GETTING list of Users', err);
        res.sendStatus(500);
    });
})
//Admin GET request to grab exercise list from databbase to display on dashboard
router.get('/exercise/:active', (req, res) => {
    const active = req.params.active;
    const queryText = `SELECT * FROM "exercises" WHERE "active" = $1;`;
    pool.query(queryText, [active]).then((response) => {
        res.send(response.rows)
    }).catch((err) => {
        console.log('Error ---------> GETTING list of Exercises', err);
        res.sendStatus(500);
    });
})

//GET request to display exercise Details
router.get('/exerciseDetail/:id', (req, res) => {
    const exerciseId = req.params.id
    const queryText = `SELECT * FROM "exercises" WHERE "id" = $1;`;
    pool.query(queryText, [exerciseId]).then((response) => {
        res.send(response.rows[0])
    }).catch((err) => {
        console.log('Error ---------> GETTING Exercise Detail', err);
        res.sendStatus(500);
    });
})

//PUT request to update specific exercise detail changes
router.put('/exerciseDetail/:id', (req, res) => {
    const exerciseId = req.params.id
    const exercise = req.body
    const queryValues = [
        exercise.name,
        exercise.default_sets,
        exercise.default_reps,
        exercise.default_weight,
        exercise.links,
        exercise.units,
        exerciseId
    ]
    const queryText = `UPDATE "exercises" SET ("name", "default_sets", "default_reps", "default_weight", "links", "units") = ($1, $2, $3, $4, $5, $6) WHERE "id" = $7;`;
    pool.query(queryText, queryValues)
    .then(() => {
        res.sendStatus(201)
    }).catch((err) => {
        console.log('Error ---------> updating exercise from library', err);
        res.sendStatus(500);
    });
});

//PUT REQUEST for ADMIN to archive exercises
router.put('/exerciseArchive/:id', (req, res) => {
    const exerciseId = req.params.id;
    const active = req.body.active;
    const queryText = `UPDATE "exercises" SET "active" = $1 WHERE "id" = $2;`;
    pool.query(queryText, [active, exerciseId])
    .then(() => {
        res.sendStatus(201)
    }).catch((err) => {
        console.log('Error ---------> archive exercise ', err);
        res.sendStatus(500);
    });
});


//DELETE exercise from Admin's library in database
router.delete('/exerciseDetail/:id', (req, res) => {
    const exerciseId = req.params.id
    const queryText = `DELETE FROM "exercises" WHERE "id" = $1;`;
    //console.log(`getting id: ${id} and req.body: ${points}`);
    pool.query(queryText, [exerciseId])
    .then(() => {
        res.sendStatus(201)
    }).catch((err) => {
        console.log('Error ---------> deleting exercises from library', err);
        res.sendStatus(500);
    });
});

//Admin POST request to add new exercise to list in database
router.post('/addExercise', (req, res) => {
    const exercise = req.body;
    const queryValue = [
        exercise.exerciseName,
        exercise.set,
        exercise.frequency,
        exercise.weight,
        exercise.link,
        exercise.units,
    ]
    const queryText = `INSERT INTO "exercises" ("name", "default_sets", "default_reps", "default_weight", "links", "units") VALUES ($1, $2, $3, $4, $5, $6);`;
    pool.query(queryText, queryValue).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Error adding exercis to list', err);
        res.sendStatus(500);
    });
})

//Admin GET request to get goals for a specific user
router.get('/goals/:id', (req, res) =>{
    const queryText = `SELECT * FROM "goals" WHERE "user_id" = $1;`
    pool.query(queryText, [req.params.id])
        .then((result) =>{
            res.send((result.rows))
        }).catch((error) =>{
            console.log('ERROR GETTING LIST OF GOALS FOR A USER:', error);
            res.sendStatus(500);
        })
})
//Admin GET request to get injuries for a specific user
router.get('/injuries/:id', (req, res) =>{
    const queryText = `SELECT * FROM "injuries" WHERE "user_id" = $1;`
    pool.query(queryText, [req.params.id])
        .then((result) =>{
            res.send((result.rows))
        }).catch((error) =>{
            console.log('ERROR GETTING LIST OF INJURIES FOR A USER:', error);
            res.sendStatus(500);
        })
})
//Admin POST request to post workouts for a user, send: { user_id: int, week: int }
router.post('/workouts', (req, res) =>{
    const queryText = 'INSERT INTO "workouts" ("user_id", "week") VALUES ( $1, $2 );';
    const queryInfo = [ req.body.user_id, req.body.week ]
    pool.query(queryText, queryInfo)
        .then(() =>{
            res.sendStatus(201);
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('POST WORKOUTS ERROR:', error)
        })
})
//Admin GET request to get workouts for a user send the user_id in the URL
router.get('/workouts/:id', (req, res) =>{
    const queryText = `SELECT * FROM "workouts" WHERE "user_id" = $1 ORDER BY "workouts".week DESC;`
    pool.query(queryText, [req.params.id])
        .then((result) =>{
            res.send((result.rows))
        }).catch((error) =>{
            console.log('ERROR GETTING LIST OF WORKOUTS FOR A USER:', error);
            res.sendStatus(500);
        })
})
//admin GET request to get the id of the workout that was just created with the post request, send{ user_id: int, week: int }
router.get('/workouts/exerciseWorkouts/:id', (req, res) =>{
    const queryInfo = req.params.id.split('')
    let week = '';
    for(let i = 1; i<queryInfo.length; i++){
        week = week + queryInfo[i]
    }
    const queryText = 'SELECT "workouts".id FROM "workouts" WHERE "user_id" = $1 AND "week" = $2;';
    pool.query(queryText, [queryInfo[0], week])
        .then((result) =>{
            res.send(result.rows)
            console.log(result.rows)
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('ERROR GETTING WORKOUT ID:', error )
        })
})
//Admin PUT request to update workouts for a user, send: {week number: int, id of workout: int }
router.put('/workouts', (req, res) =>{
    const queryText = 'UPDATE "workouts" SET "week" = $1 WHERE "id" = $2;';
    const queryInfo = [req.body.week, req.body.id ]
    pool.query(queryText, queryInfo)
        .then(() =>{
            res.sendStatus(200)
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('ERROR UPDATING ADMIN WORKOUTS:', error)
        })
})

//Admin POST request to add exercise workouts for a user, send: { workout_id: int, exercise_id: int, assigned_sets: int, assigned_reps: int, assigned_weight: int, tips: "String" }
router.post('/exerciseWorkouts', (req, res) =>{
    const queryText = 'INSERT INTO "exercise_workouts" ("workout_id", "exercise_id", "assigned_sets", "assigned_reps", "assigned_weight", "tips") VALUES ( $1, $2, $3, $4, $5, $6);';
    const queryInfo = [ req.body.workout_id, req.body.exercise.exercise_id, req.body.exercise.assigned_sets, req.body.exercise.assigned_reps, req.body.exercise.assigned_weight, req.body.exercise.tips ]
    pool.query(queryText, queryInfo)
        .then(() =>{
            res.sendStatus(201)
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('ERROR POSTING EXERCISE WORKOUTS:', error)
        })
})
//Admin POST request to add exercise workouts for a user, send: { workout_id: int, exercise_id: int, assigned_sets: int, assigned_reps: int, assigned_weight: int, tips: "String" }
router.post('/newExerciseWorkouts', (req, res) =>{
    const queryText = 'INSERT INTO "exercise_workouts" ("workout_id", "exercise_id", "assigned_sets", "assigned_reps", "assigned_weight", "tips") VALUES ( $1, $2, $3, $4, $5, $6);';
    const queryInfo = [ req.body.workout_id, req.body.exercise_id, req.body.assigned_sets, req.body.assigned_reps, req.body.assigned_weight, req.body.tips ]
    pool.query(queryText, queryInfo)
        .then(() =>{
            res.sendStatus(201)
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('ERROR POSTING EXERCISE WORKOUTS:', error)
        })
})
//Admin PUT request to exercise workouts for a user, send: { id: int, assigned_sets: int, assigned_reps: int, assigned_weight: int, tips: "String" }
router.put('/exerciseWorkouts', (req, res) =>{
    const queryText = 'UPDATE "exercise_workouts" SET "assigned_sets" = $1, "assigned_reps" = $2, "assigned_weight" = $3, "tips" = $4 WHERE "id" = $5;';
    const queryInfo = [ req.body.assigned_sets, req.body.assigned_reps, req.body.assigned_weight, req.body.tips, req.body.id ]
    pool.query(queryText, queryInfo) 
        .then(() =>{
            res.sendStatus(200)
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('ERROR UPDATING ADMIN EXERCISE WORKOUTS:', error)
        })
})
//admin DELETE request to exervise workouts for a user, send the id of the exercise workout that you want to delete
router.delete('/exerciseWorkouts/:id', (req, res) =>{
    const queryText = 'DELETE FROM "exercise_workouts" WHERE "id" = $1;';
    pool.query(queryText, [req.params.id])
        .then(() =>{
            res.sendStatus(200)
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('ERROR DELETEING EXERCISE WORKOUTS:', error)
        })
})
//admin GET request to get complicance for a user, automatically gets the data of the "current user"
router.get('/data/:id', (req, res) =>{
    const queryText = 'SELECT "exercise_workouts".completed, "workouts".week FROM "exercise_workouts" JOIN "workouts" ON "workouts".id = "exercise_workouts".workout_id WHERE "workouts".user_id = $1;';
    pool.query(queryText, [req.params.id])
        .then((result) =>{
            res.send(determineCompliance(result.rows))
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('ERROR GETTING COMPLIANCE DATA:', error)
        })
})

function determineCompliance(array){
    let compliance = []
    let maxWeek = 0;
    for(let i = 0; i < array.length; i++){
        if(array[i].week > maxWeek){
            maxWeek = array[i].week
        }
    }
    for(let i = 1; i < maxWeek + 1; i++){
        let completed = 0
        let total = 0
        let incomplete = 0
        for(let j = 0; j < array.length; j++){
            if(array[j].week === i){
                total++
                if(array[j].completed){
                    completed++
                }
                else {
                    incomplete++
                }
            }
        }
        compliance.push({week: i, completed: completed, total: total, incomplete: incomplete})
    }
    return compliance;
}

router.get('/weeks/:id', (req, res) =>{
    const queryText = 'SELECT "workouts".week FROM "workouts" JOIN "user" ON "workouts".user_id = "user".id WHERE "user".id = $1;';
    pool.query(queryText, [req.params.id])
        .then((result) =>{
            res.send(result.rows)
        }).catch((error) =>{
            res.sendStatus(500)
            console.log('ERROR GETTING WEEKS DATA:', error)
        })
})
router.get('/email/:id', (req, res) =>{
    const queryText = 'SELECT * FROM "user" WHERE "id" = $1;';
    pool.query(queryText, [req.params.id])
        .then((result) =>{
            let to = result.rows[0]
            emailSender(to).catch(console.error)
        }).catch((error)=>{
            console.log('SEND EMAIL ERROR:', error)
        })
})
async function emailSender(user) {


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: 'PhitnessNationEmailBot',
            pass: 'PhitnessPhun1234'
        }
    });
    let info = await transporter.sendMail({
        from: '"Phit Nation" <phitnessnationemailbot@gmail.com>', 
        to: `<${user.email}>`,
        subject: 'You have a new Workout from Phil', 
        text: `Hello, ${user.name}`, 
        html: `<b>Hello, ${user.name}</b>`
    })

    console.log('Message sent: %s', info.messageId)

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

}

router.get('/exercises/:id', (req, res) =>{
    const queryText = 'SELECT "exercise_workouts".*, "exercises".name FROM "exercise_workouts" JOIN "exercises" ON "exercise_workouts".exercise_id = "exercises".id WHERE "workout_id" = $1;';
    pool.query(queryText, [req.params.id])
        .then((result) =>{
            console.log('the result is:', result.rows)
            res.send(result.rows)
        }).catch((error) =>{
            console.log('GET EXERCISES FOR ONE WOKROUT ERROR:', error)
        })
})

//req.params is an array with one just index (the user's id)
router.put('/reactivate/:id', (req, res) => {
    console.log("req: ", req.body, req.params.id);
    const userId = req.params.id;
    let queryText = `UPDATE "user" SET "active" = 'True' WHERE "id" = $1;`
    pool.query(queryText, [userId])
        .then(() => {
            res.sendStatus(200);
        }).catch((error) => {
            res.sendStatus(500);
            console.log('REACTIVATE USER INFO ERROR:', error);
        })
})


module.exports = router;
