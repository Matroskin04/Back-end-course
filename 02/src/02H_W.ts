import {blogsRoutes} from "./routes/blogs-routes";
import bodyParser from 'body-parser'

const app = express()
const port = 3000

// const authorizedUser = {
//     login: 'admin',
//     password: 'qwerty'
// }

app.use(bodyParser({}))

app.use('/hometask-02/blogs', blogsRoutes)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
