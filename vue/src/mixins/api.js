export default {   
    methods: {
      
      //
      // GET - fetch all todos
      //
      apiGetTodos: function() {  
        return fetch(`${this.apiEndpoint}/todos`)
        .then(resp => {
          if (!resp.ok) throw Error(resp.statusText)
          return resp.json()
        })
      },

      //
      // PUT - single todo update
      //
      apiPutTodo: function(id, todo) {  
        let request = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo)
        }

        return fetch(`${this.apiEndpoint}/todos/${id}`, request)
        .then(resp => {
          if (!resp.ok) throw Error(resp.statusText)
          return resp.json()
        })
      },

      //
      // POST - single todo create
      //      
      apiPostTodo: function(todo) {  
        let request = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo)
        }

        return fetch(`${this.apiEndpoint}/todos`, request)
        .then(resp => {
          if (!resp.ok) throw Error(resp.statusText)
          return resp.json()
        })
      },      

      // 
      // DELETE - single todo delete
      //
    apiDeleteTodo: function(id) {  
      let request = {
        method: 'DELETE',
      }

      return fetch(`${this.apiEndpoint}/todos/${id}`, request)
      .then(resp => {
        if (!resp.ok) throw Error(resp.statusText)
        return resp.json()
      })
    } 
  }
}