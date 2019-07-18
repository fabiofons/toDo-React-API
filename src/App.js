import React, { Component } from 'react';
import './index.css';

/// Modifica el componente para que se puedan agregar tareas, tachar y destacharlas y error de validacion en el input

class App extends Component {
  constructor() {
    super()
    this.state = {
      tasks: [
        { id: 1, name: "Sacar la ropa", done: false },
        { id: 2, name: "Hacer la cama", done: true },
        { id: 3, name: "Leer un rato", done: false }
      ],
      newTask: '',
      isEmpty: false,
    }
    this.manageState = this.manageState.bind(this)
  }
  
  handleSubmit(e) {
    e.preventDefault()
    if (this.state.newTask !== "") {
      const tasks = this.state.tasks;
      const addTask = {
          id: Math.max(...tasks.map(t => t.id)) + 1,
          name: this.state.newTask,
          done: false
      };
      this.setState({
        tasks: [...tasks, addTask],
        newTask: "",
        isEmpty: false
      })
      //aqui va el post hacia el servidor
      this.postItems(addTask)

    } else {
      this.setState({
        isEmpty: true
      })
    }
  }

  handleChange(e) {
    this.setState({
      newTask: e.target.value
    })
  }

  manageState(e) {
    this.updateItems(e)
    this.setState({
      tasks: this.state.tasks.map(t => {
        if (t.id === e) {
          t.done = !t.done;
        }
        return t;
      })      
    })  
  }

  async getItems() {
    try {
      const res = await fetch(`http://makeitreal-todo.herokuapp.com/todo_items`);
      const data = await res.json();
      const tasks = this.state.tasks;
      const newTasks = await data.map(t => {
        const newTask = {
          id: t.id,
          name: t.title,
          done: t.done
        };
        return newTask;
      });
      this.setState({
        tasks: [...tasks, ...newTasks]
      });
    } catch (e) {
      console.log(e);
    }
  }
  
  async postItems(task) {
    try {
      let response = await fetch(`http://makeitreal-todo.herokuapp.com/todo_items`, {
        "method": "POST",
        "headers": { "Content-Type": "application/json" },
        "body": `{"title": "${task.name}"}`
      })
      await console.log(response)
    }catch(e) {
      console.log(e)
    }
  }

  async updateItems(id) {
    try {
      const task = this.state.tasks.filter(t => t.id === id);
      let response = await fetch(`http://makeitreal-todo.herokuapp.com/todo_items/${id}`, {
        "method": "PATCH",
        "headers": { "Content-Type": "application/json" },
        "body": `{"done": ${!(task[0].done)}}`
      })
      await console.log(response)
    }catch(e) {
      console.log(e)
    }
  }

  componentDidMount() {
    this.getItems()
  }

  render() {
    return (
      <div className="wrapper">
        <div className="list">
          <h3>Por hacer:</h3>
          <ul className="todo">
            {this.state.tasks.map((task, index) => 
              <li key={task.id} onClick={() => this.manageState(task.id)} className={task.done ? "done" : null}>{task.name}</li>
            )}
          </ul>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" id="new-task" className={this.state.isEmpty ? "error" : null} value={this.state.newTask} placeholder="Ingresa una tarea y oprime Enter" onChange={this.handleChange.bind(this)} />
          </form>
        </div>
      </div>
    )
  }

  
}

export default App;
