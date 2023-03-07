// import express, {Request, Response} from 'express'
// import bodyParser from "body-parser";
//
// const app = express()
// const port = 3001
//
// const students = [{id: 1, name: 'Vlad'}, {id: 2, name: 'Nikita'}]
//
//
// const parserMiddeleware = bodyParser({})
// app.use(parserMiddeleware)
//
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello World!')
// })
// app.get('/students', (req: Request, res: Response) => {
//     if (req.query.name) {
//         let partName = req.query.name.toString();
//         res.send(students.filter(p => p.name.indexOf(partName) !== -1))
//     } else {
//         res.send(students)
//     }
// })
// app.get('/students/:currentStudent', (req: Request, res: Response) => {
//     let student = students.find(p => p.name === req.params.currentStudent)
//     if (!student) res.send(404)
//     else res.send(student)
// })
// app.delete('/students/:id', (req: Request, res: Response) => {
//     for (let i = 0; i < students.length; i++) {
//         if (students[i].id === +req.params.id) {
//             students.splice(i,1);
//             res.send(204);
//             return;
//         }
//     }
//     res.send(404)
// })
// app.post('/students', (req: Request, res: Response) => {
//     const newStudent = {
//         id: +(new Date()),
//         name: req.body.name
//     }
//     students.push(newStudent)
//     res.status(201).send(newStudent)
// })
// app.put('/students/:elem', (req: Request, res: Response) => {
//     let elem = +req.params.elem
//     if (elem < students.length) {
//         students[elem].name = req.body.name
//         res.status(200).send(students[elem])
//     } else {
//         res.send(404)
//     }
// })
//
//
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })
