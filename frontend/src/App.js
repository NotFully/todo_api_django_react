import './App.css';
import React from "react";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            activeItem: {
                id: null,
                task: '',
                status: false,
            },
            editing: false,
        }
        this.fetchTasks = this.fetchTasks.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.strikeUnstrike = this.strikeUnstrike.bind(this)

    };

    getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    componentDidMount() {
        this.fetchTasks()
    }

    fetchTasks(){
        console.log("Fetching...")

        fetch('http://127.0.0.1:8000/api/task-list/')
            .then(response => response.json())
            .then(data =>
                this.setState({
                    todoList:data
                })
            )
    }

    handleChange(e){
        var name = e.target.name
        var value = e.target.value
        console.log(name, value)

        this.setState({
            activeItem: {
                ...this.state.activeItem,
                task:value
            }
        })
    }

    handleSubmit(e){
        e.preventDefault()
        console.log('ITEM', this.state.activeItem)

        var csrftoken = this.getCookie('csrftoken')
        
        var url = "http://127.0.0.1:8000/api/task-create/"

        if (this.state.editing === true){
            url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`
            this.setState({
                editing:false
            })
        }

        fetch(url, {
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify(this.state.activeItem)
        }).then(response => {
                this.fetchTasks()
                this.setState({
                    activeItem: {
                        id: null,
                        task: '',
                        status: false,
                    }
                })
            }).catch(function (error){
                console.log('ERROR: ',error)
        })
    }

    deleteItem(task){
        var csrftoken = this.getCookie('csrftoken')

        fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
        }).then((response) =>{

            this.fetchTasks()
        })
    }

    startEdit(task){
        this.setState({
            activeItem:task,
            editing: true,
        })
    }

    strikeUnstrike(task){

        task.status = !task.status
        var csrftoken = this.getCookie('csrftoken')
        var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`

        fetch(url, {
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({'status': task.status, 'task':task.task})
        }).then(() => {
            this.fetchTasks()
        })

        console.log('TASK:', task.status)
    }

    render() {
        var tasks = this.state.todoList
        var self = this
        return(
            <div className="container">
              <div id="task-container">
                <div className="form-wrapper">
                    <form onSubmit={this.handleSubmit}  id="form">
                        <div className="flex-wrapper">
                            <div style={{flex: 6}}>
                                <input onChange={this.handleChange} className="form-control" id="task" value={this.state.activeItem.task} type="text" name="task" placeholder="Add task.." />
                            </div>

                            <div style={{flex: 1}}>
                                <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="list-wrapper">
                    {tasks.map(function (task, index){
                        return(
                            <div key={index} className="task-wrapper flex-wrapper">
                                <div onClick={() => self.strikeUnstrike(task)} style={{flex:7}}>
                                    {task.status === false ? (
                                        <span>{task.task}</span>

                                    ) : (

                                        <strike className="completed">{task.task}</strike>
                                    )}
                                </div>
                                <div style={{flex: 1}}>
                                    <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Изменить</button>
                                </div>
                                <div style={{flex: 1}}>
                                    <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">Удалить</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
              </div>
            </div>
        )
  }
}

export default App;
