const { request } = require('express');
const express = require('express');
const { v4: uuidv4 } = require("uuid")

const toDo = []

const app = express();
app.use(express.json())

function VerifyExistisName(request, response, next) {
    const { username } = request.headers;
    const nameAccount = toDo.find((users) => users.username === username);

    if (!nameAccount) {
        response.status(400).json({ error: "User not found" })
    }
    request.nameAccount = nameAccount;
    return next()
}

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

app.get("/todos", VerifyExistisName, (request, response) => {
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

app.patch("/todos/:id/done", VerifyExistisName, (request, response) => {
    const { nameAccount } = request
    const { id } = request.params

    const todo = nameAccount.todos.find(v => v.id === id);
    todo.done = true

    return response.json(todo)
})

app.delete("/todos/:id", (request, response) => {
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

module.exports = app;