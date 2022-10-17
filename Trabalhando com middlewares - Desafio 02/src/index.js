const { request, response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require("uuid")

const toDo = []

const app = express();
app.use(express.json())

function VerifyExistisName(request, response, next) {
    const { username } = request.headers;
    const nameAccount = toDo.find((users) => users.username === username);

    if (!nameAccount) {
        response.status(404).json({ error: "User not found" })
    }
    request.nameAccount = nameAccount;
    return next()
}

function checksCreateTodosUserAvailability(request, response, next) {
    const { nameAccount } = request

    if(nameAccount.pro) {
        return next();
    } else if(!nameAccount.pro && nameAccount.todos.length + 1 <= 10){
        return next()
    }

    return response.status(403).json({ error: "You already have ten todos createad. Please, change to Pro plan"})
}

function checksTodoExists(request, response, next) {
    const { username } = request.headers;
    const { id } = request.params
    const nameAccount = toDo.find((users) => users.username === username);

    if (!nameAccount) {
        response.status(400).json({ error: "User not found" })
    }

    if(!ValidityState(id)) {
        return response.status(400).json({ error: "Todo ID encorrect." });
    }

    const userTodos = toDo.todos.find(todo => todo.id == id);

    if(!userTodos) {

        return response.status(400).json({error: "Todo don´t found."});
    }

    request.nameAccount = nameAccount

    return next()
}

function findUserById(request, responnse, next) {
    const { id } = request.params;

    const user = toDo.find(user => user.id === id);

    if(!user) {
        return response.status(404).json({ error: "Userdon´t found"})
    }

    request.nameAccount = nameAccount;

    return next()
}

app.get('/users/:id', findUserById, (resquest, response) => {
    const { nameAccount } = request;

    return response.json(user)
})

app.patch("/users/:id/pro", (request, response) =>{
    const { nameAccount } = request

    if (user.pro) {
        return response.status(400).json( { error: "Pro plan is already activated." });
    }

    user.pro = true;

    return response.json(user)
})


app.post("/users", (request, response) => {
    const { name, username } = request.body;
    const alreadyExistsAccount = toDo.some(
        (todoAccount) => todoAccount.name === name

    );
    if (alreadyExistsAccount) {
        return response.status(400).json({ error: "User alredy exists!" })
    }

    toDo.push({
        id: uuidv4(),
        name,
        username,
        todos: []
    })
    return response.status(201).send();
})

app.get("/todos", VerifyExistisName, checksCreateTodosUserAvailability,
 (request, response) => {
    const { nameAccount } = request;
    return response.json(nameAccount.todos);
})

app.post("/todos", VerifyExistisName, (request, response) => {
    const { title, deadline } = request.body;
    const { nameAccount } = request;

    const addTodo = {
        id: uuidv4(),
        title,
        done: false,
        pro: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }
    nameAccount.todos.push(addTodo)

    return response.status(201).send()

})
app.put('/todos/:id', VerifyExistisName, (request, response) => {
    const { nameAccount } = request
    const { title, deadline } = request.body
    const { id } = request.params
    const todo = nameAccount.todos.find(v => v.id === id);

    if (!todo) {
        return response.status(404).json()
    }

    todo.title = title;
    todo.deadline = new Date(deadline);

    if (!todo) {
        return response.status(404).json()
    }

    return response.json({ error: 'Todo not found' });
})

app.patch("/todos/:id/done", VerifyExistisName, checksTodoExists, (request, response) => {
    const { nameAccount } = request
    const { id } = request.params

    const todo = nameAccount.todos.find(v => v.id === id);
    todo.done = true

    return response.json(todo)
})

app.delete("/todos/:id", checksTodoExists, (request, response) => {
    const { nameAccount } = request
    const { id } = request.params

    const todoIndex = nameAccount.todos.findIndex(todo => todo.id === id)

    if (todoIndex === -1) {
        return response.status(404).json()
    }
    user.todos.splice(todoIndex, 1)

    return  response.status(204).json();

})

app.listen(3322);
