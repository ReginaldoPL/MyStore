const app = require('./server')
const supertest = require('supertest')
const request = supertest(app)




app.get("/", (req, res) => {
    res.json({ message: "Hello, this is the TesteSS - Teste to Job in SouthSystem NodeJS Oportunity :o)" });
});



  it('Gets the test endpoint', async done => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/')
    console.log(res)

    done()
  })
