import express from 'express'
import {prisma} from 'db/client'
const app = express()

app.use(express.json())

app.post("/signup", async(req, res) => {
  const { username, password } = req.body;
  await prisma.user.create({
    data: {
      username,
      password
    }
  })
  res.json({
    message:"signup successfull"
  })
})

app.listen(3000)