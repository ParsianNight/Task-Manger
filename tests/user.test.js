const request  = require ('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { findById } = require('../src/models/task')
const { setupDatabase,userOneId,userOne  } = require('./fixtures/db')



beforeEach(setupDatabase)

test('Should signup a new user' , async() => {

    await request(app)
            .post('/users')
            .send({
                name: "Omar",
                email: "omar@test.com",
                password: 'de7ko123!'
                
            })
            .expect(201)
})


test('Should login existing user!' , async() => {

   const response =  await request(app)
            .post('/users/login')
            .send({
                email: userOne.email,
                password: userOne.password
                
            })
            .expect(200)

            const user = await User.findById(userOneId)
            expect(user).not.toBeNull()
            expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexistent user', async() => {
    await request(app)
            .post('/users/login')
            .send({
                email: "aykalam@yahoo.com",
                password: "aykalam"
            })
            .expect(400)
})

test('Shoud yield back user info' , async() => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
       


    })

test('Should not get profile for non authenticated users', async() => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user' , async() => {
    const response =    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})

test('Should not delete account for  non authenticated users', async() => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})


test('Should upload avatar for user', async() => {
    await request(app)
    .post('/users/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/sample.jpg')
    .expect(201)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
    
})



test('Should update valid user data', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'test'
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('test')
})


test('Should  not update for nonauthenticated user', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        field: 'test'
    })
    .expect(400)
})