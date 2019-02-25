import * as express from "express"
import * as safen from "@safen/express"

const app = express()
app.use(express.json())

interface CreateUserRequest {
  username: string
  password: string
  name: string | null
}

interface UpdateUserRequest {
  username?: string
  password?: string
  name?: string | null
}
app.get("/users", safen.query(`{
  name?: string & length_between(1, 20),
  orderby?: string,
}`), ({query}, res) => {
  return res.json({
    query,
    data: {
      users: [],
    },
  })
})

app.post("/users", safen.body(`{
  username: string & email,
  password: string & length_between(8, 40),
  name: (string & length_between(1, 20)) | null,
}`), ({body}: {body: CreateUserRequest}, res) => {
  return res.json({
    data: {
      user: {
        username: body.username,
        name: body.name,
      },
    },
  })
})

app.put("/users/:id", safen.body(`{
  username?: string & email,
  password?: string & length_between(8, 40),
  name?: (string & length_between(1, 20)) | null,
}`), ({body}: {body: UpdateUserRequest}, res) => {
  return res.json({
    data: {
      user: {
        username: body.username,
        name: body.name,
      },
    },
  })
})

// safen exception handler
app.use(safen.errorHandler())

app.listen(8080, () => {
  console.log("listen 8080 🚀")
})
