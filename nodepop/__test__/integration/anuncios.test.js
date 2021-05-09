const request = require('supertest');
const app = require('../../app');
jest.setTimeout(10000); // 10 seconds

//const apiAuth = require('../../controllers/loginController');
const userObj = {
    email: 'user@example.com',
    password: '1234'
}
const userObjFake = {
    email: 'fake@example.com',
    password: '1234'
}

/**
 * Declaro la variable token variable para que este accesible en todo el test suite
*/ 
    
let token;

beforeAll((done) => {
   request(app)
    .post('/api/authenticate')
    .send(userObj)
    .end((err, response) => {
       token = response.body.token; // guardo el token
       done();
    });
});

describe('API Authentication', () => {
    it('it should return an JSON with a token property', async () => {
        const res = await request(app)
            .post('/api/authenticate')
            .send(userObj)
        expect(res.body).toHaveProperty('token');
        expect(res.statusCode).toEqual(200);
    })
    it('it should return a 401 error with a user incorrect', async () => {
        const res = await request(app)
            .post('/api/authenticate')
            .send(userObjFake)
        expect(res.statusCode).toEqual(401);
    })
});

describe('Testing /api/anuncios', () => {

    describe('GET /api/anuncios sin JWT', () => {
        it('it should fetch an empty array', async () => {
            
            const res = await request(app)
                .get('/api/anuncios');
            
            expect(res.statusCode).toEqual(401);
            expect(res.body).toMatchObject({});
     
        })
    })

    describe('GET /api/anuncios', () => {
        // token not being sent - should respond with a 401
        it('It should require authorization', () => {
            return request(app)
                .get('/api/anuncios')
                .then((response) => {
                    expect(response.statusCode).toBe(401);
                })
        })
        
        // send the token - should respond with a 200
        it('It responds with JSON', () => {
            //console.log(token);
            return request(app)
                .get('/api/anuncios')
                .set('Authorization', token)
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.type).toBe('application/json');
                })
        })

       // es el mismo test que el de arriba
        it.skip("should get all ads", async () => {
              await request(app)
                .get("/api/anuncios")
                .set("Accept", "application/json")
                .set('Authorization', token)
                .expect("Content-Type", /json/)
                .expect(200);
        });
          

    describe('GET /api/anuncios/:id', () => {
            // it('should fetch 1 single ad for id = ', async (done) => {
            //   const res = await request(app)
            //     .get('/users/1');
        
            //   expect(res.statusCode).toEqual(200);
            //   expect(res.body.user.name).toMatch(/winnie/i);
        
            //   done();
            // })
        it('should fetch not found for a ad with id = 601fe467842fa20e151eab78', () => {
            return request(app)
                    .get('/api/anuncios/601fe467842fa20e151eab78')
                    .set('Authorization', token)
                    .then((response) => {
                        expect(response.statusCode).toEqual(404);
                    });
            })
        })
        
    })

    describe('POST /api/anuncios/', () => {
        test.skip("POST /api/anuncios", async () => {
            const data = {
                nombre: "prueba test", 
                venta:  true,
                precio: 10, 
                foto: '',
                tags: ['lifestyle', 'work'] 
            }
    
            await request(app)
                .post("/api/anuncios")
                .set('Authorization', token)
                .send(data)
                .expect(201)
                .then(async (response) => {
                    // Check the response
                    expect(response.body._id).toBeTruthy()
                    expect(response.body.nombre).toBe(data.nombre)
                    expect(response.body.venta).toBe(data.venta)
                    expect(response.body.precio).toBe(data.precio)
                    expect(response.body.foto).toBe(data.foto)
                    expect(response.body.tags).toBe(data.tags)
                    // Check the data in the database
                    const post = await Post.findOne({ _id: response.body._id })
                    expect(post).toBeTruthy()
                    expect(post.nombre).toBe(data.nombre)
                    expect(post.venta).toBe(data.venta)
                    expect(post.precio).toBe(data.precio)
                    expect(post.foto).toBe(data.foto)
                    expect(post.tags).toBe(data.tags)
                })
        })
        
    })
})

