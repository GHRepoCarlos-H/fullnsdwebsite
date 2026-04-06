Backend

User Login
POST http://localhost:5000/api/auth/login

test login admin@test.com password123

{
  "email": "admin@test.com",
  "password": "password123"
}

{
  "name": "Maria Lopez",
  "email": "maria@example.com",
  "password": "TempPass123",
  "role": "supervisor"
}

Troy Romo
Troy@test.com
123456

Steve LaComb
steve@test.com
password23
manager

GET http://localhost:5000/api/users

Start backend (npm run dev)


Frontend

npm run dev
