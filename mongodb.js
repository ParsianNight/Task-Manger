// CURD  create update read delete

const {MongoClient, ObjectID} =  require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//  const id  = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())
// MongoClient.connect(connectionURL,{useNewUrlParser: true}, (error,client) => { 
//     if(error)
//     return console.log('Unable to connect to the database!')

//     const db = client.db(databaseName)
    
//      updatePromise = db.collection('users').updateOne({_id: new ObjectID("62f103ff0ecf1f7f7c11c542")},{$inc: {
//         age: 10
//     }}).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)   
//     })

// db.collection('users').updateMany(
//     {
//         age:'19'
//     },{
//         $set: {
//             age:'29'
//         }
//     }
// ).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

// db.collection('tasks').deleteMany({
//     description:'eat meals'
//  }).then((result) => {
//     console.log(result)
//  }).catch((error) => {
//     console.log(error)
//  })



//  })
