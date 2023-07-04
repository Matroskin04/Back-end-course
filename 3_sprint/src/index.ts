import {runDb} from "./db";
import {app} from "./setting";

const port = process.env.PORT || 5000

const startApp = async () => {

    await runDb();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
