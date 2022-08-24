const request  = require ('supertest')
const app = require('../src/app')
const Task= require('../src/models/task')
const { userOneId,userOne,userTwo,taskThree,setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Shoud create  task for user', async() => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send({
        description:'Dummy',
    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should only retrun number of tasks we own', async() => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    expect(response.body.length).toBe(2)
})

test('Should not delete other users\' task', async() => {
    const response = await request(app)
    .delete('/tasks/'+taskThree._id)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(404)
    const task = await Task.findById(taskThree._id)
    expect(task).not.toBeNull()
})