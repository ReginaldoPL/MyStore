const app = require('./server')
const supertest = require('supertest')
const request = supertest(app)

const controller = require("./app/controllers/auth.controller");

const { authJwt } = require("./app/middlewares");
const { verifySignUp } = require("./app/middlewares");
const db = require("./app/models");
const Role = db.role;
const User = db.user;

const dbConfig = require("./app/config/db.config");
var bcrypt = require("bcryptjs");

app.get("/", (req, res) => {
    res.json({ message: "Hello, this is the TesteSS - Teste to Job in SouthSystem NodeJS Oportunity :o)" });
});

app.post("/api/auth/signin", controller.signin);

 //add user
 app.post("/api/user",
 [
  // authJwt.verifyToken,
   //authJwt.isAdmin,
   verifySignUp.checkDuplicateUsernameOrEmail,
   verifySignUp.checkRolesExisted
 ],
 controller.signup
);

/*require('./app/routes/auth.routes')(app);

require('./app/routes/product.routes')(app);*/
const dbHandler = require('./test/db-handler');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect()
    Role.estimatedDocumentCount((err, count) => {
       
        if (!err && count === 0) {
          new Role({
            name: "user"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
    
            //console.log("added 'user' to roles collection");
          });
          new Role({
            name: "admin"
          }).save((err,roleAdmin) => {
            if (err) {
              console.log("error", err);
            }
            User.estimatedDocumentCount((err, count) => {
              if (!err && count === 0) {
                  new User({
                      username: "admin",
                      email: "reginaldo.pedro.de.lima@gmail.com",
                      password: bcrypt.hashSync("admin", 8),
                      roles: [roleAdmin._id]
                    }).save(err => {
                    if (err) {
                      console.log("error", err);
                    }
            
                   // console.log("added 'user Admin' to roles collection");
                  });
              }
          });
    
           // console.log("added 'admin' to roles collection");
          });
        }
      });   
    
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());


 let token = '';


  it('Verificar se a API está no ar', async () => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/')
  
    expect(res.body).toHaveProperty('message')

   // done()
  });
  
    it('Verificar o Login', async () => {
        const response = await request
        .post('/api/auth/signin')
        .send({username: 'admin', password:'admin'});        
        expect(response.status).toBe(200);        
        expect(response.body).toHaveProperty("accessToken"); 
        token = response.body.accessToken;    
    });
  
    it('Verificar Cadastro de Usuário Novo', async () => {
      
        let userNew = {
            "username": "user" ,
            "password": "user",
            "email": "user@user.com" ,
            "roles": ["user"]
        }
        const response = await request
        .post('/api/user')        
        .set('Content-Type',  'application/json') 
        .send(userNew);                       
        expect(response.status).toBe(200);       
        expect(response.body).toHaveProperty("message","User was registered successfully!");  
    });
    it('Verificar Cadastro de Usuário com username Vazio', async () => {
      
        let userNew = {
            "username": "" ,
            "password": "user",
            "email": "user@user.com" ,
            "roles": ["user"]
        }
        const response = await request
        .post('/api/user')        
        .set('Content-Type',  'application/json') 
        .send(userNew);                       
        expect(response.status).toBe(400);       
        expect(response.body).toHaveProperty("message","Failed! Username is empty!");  
    });
    it('Verificar Cadastro de Usuário com password Vazio', async () => {
      
        let userNew = {
            "username": "user" ,
            "password": "",
            "email": "user@user.com" ,
            "roles": ["user"]
        }
        const response = await request
        .post('/api/user')        
        .set('Content-Type',  'application/json') 
        .send(userNew);                       
        expect(response.status).toBe(400);       
        expect(response.body).toHaveProperty("message","Failed! password is empty!");  
    });
    it('Verificar Cadastro de Usuário com email Vazio', async () => {
      
        let userNew = {
            "username": "user" ,
            "password": "xxxxx",
            "email": "" ,
            "roles": ["user"]
        }
        const response = await request
        .post('/api/user')        
        .set('Content-Type',  'application/json') 
        .send(userNew);                       
        expect(response.status).toBe(400);       
        expect(response.body).toHaveProperty("message","Failed! email is empty!");  
    });
    it('Usuário - Verificar cadastro de 2 usuário com mesmo nome', async () => {
      
        let userNew = {
            "username": "user" ,
            "password": "user",
            "email": "user@user.com" ,
            "roles": ["user"]
        }
        const response = await request
        .post('/api/user')        
        .set('Content-Type',  'application/json') 
        .send(userNew);                       
        expect(response.status).toBe(200);   
        
        let userNew2 = {
            "username": "user" ,
            "password": "user2",
            "email": "user2@user.com" ,
            "roles": ["user"]
        }
        
        const response2 = await request
        .post('/api/user')        
        .set('Content-Type',  'application/json') 
        .send(userNew2);         
        expect(response2.status).toBe(400);         
        expect(response2.body).toHaveProperty("message","Failed! Username is already in use!"); 
      
    });
    it('Usuário - Verificar cadastro de 2 usuário com mesmo Email', async () => {
      
        let userNew = {
            "username": "user" ,
            "password": "user",
            "email": "user@user.com" ,
            "roles": ["user"]
        }
        const response = await request
        .post('/api/user')        
        .set('Content-Type',  'application/json') 
        .send(userNew);                       
        expect(response.status).toBe(200);   
        
        let userNew2 = {
            "username": "user2" ,
            "password": "user",
            "email": "user@user.com" ,
            "roles": ["user"]
        }
        
        const response2 = await request
        .post('/api/user')        
        .set('Content-Type',  'application/json') 
        .send(userNew2);         
        expect(response2.status).toBe(400);         
        expect(response2.body).toHaveProperty("message","Failed! Email is already in use!"); 
      
    });


  //verificar se 


  //verificar se o login retorna um token

  //tentar adicionar um usuário sem nome



