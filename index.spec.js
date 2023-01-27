const request = require("supertest");
const server = require("./index");

describe("CRUD cafetería", () => {

  it('should return an array of coffees', async () => {
    const response = await request(server).get('/cafes').send();
    const status = response.statusCode;
    const body = response.body;
    console.log(body.length);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body.length).toBeGreaterThanOrEqual(1);
  });

  it('should return status 400 when coffee is does not exist', async () => {
    const jwt = 'Token';
    const idEliminar = 100;
    const response = await request(server)
      .delete(`/cafes/${idEliminar}`)
      .set("Authorization", jwt)
      .send();

    expect(response.status).toBe(404);
  });

  it('should create a new coffee and return status 201', async () => {
    const id = Math.floor(Math.random() * 999);
    const cafe = { id, nombre: "Nuevo cafe" };
    const response = await request(server).post('/cafes').send(cafe);
    
    expect(response.status).toBe(201);
    expect(response.body).toContainEqual(cafe);
  });

  it('shloud return status 400 when a coffee is updated sending different ids', async () => {
    const id = 2
    const payload = {
      id: 3,
      nombre: "Americano"
    }
    const response = await request(server).put(`/cafes/${id}`).send(payload);
    expect(response.status).toBe(400);
  });
 
});

describe('Extra tests', () => {
  
  it('should find one coffee by id and returning status 200', async () => {
    const response = await request(server).get('/cafes/1').send();
    const status = response.statusCode;
    expect(status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).not.toBeInstanceOf(Array)
  });

  it('should return status 400 when dose not found a coffee', async () => {
    const response = await request(server).get('/cafes/500').send();
    const status = response.statusCode;
    expect(status).not.toBe(200);
    expect(status).toBe(404);
  });

  it('should return status 400 when a existen coffee is added', async () => {
    const id = 1
    const cafe = { id, nombre: "Nuevo cafe" };
    const response = await request(server).post('/cafes').send(cafe);
    
    expect(response.status).toBe(400);
  });

  it('should return an array when the update is correct', async () => {
    const id = 2
    const payload = {
      id: id,
      nombre: "Americano"
    }
    const response = await request(server).put(`/cafes/${id}`).send(payload);
    expect(response.body).toBeInstanceOf(Array);
  });
});