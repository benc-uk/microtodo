export default {
    data: function () {
      return {
        apiEndpoint: "http://192.168.0.53:3000"
      }
    },
    
    methods: {
      apiGetTodos: function() {  
        return fetch(`${this.apiEndpoint}/todos`)
          .then(resp => {
            return resp.json();
          })
          .catch(err => {
            // eslint-disable-next-line
            console.log(`### API Error! ${err}`);
          })
      },

      apiPutTodo: function(id, todo) {  
        let request = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todo)
        }
        return fetch(`${this.apiEndpoint}/todos/${id}`, request)
          .then(resp => {
            return resp.json();
          })
          .catch(err => {
            // eslint-disable-next-line
            console.log(`### API Error! ${err}`);
          })
      },
      
      apiPostTodo: function(todo) {  
        let request = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todo)
        }
        return fetch(`${this.apiEndpoint}/todos`, request)
          .then(resp => {
            return resp.json();
          })
          .catch(err => {
            // eslint-disable-next-line
            console.log(`### API Error! ${err}`);
          })
      },        

    apiDeleteTodo: function(id) {  
      let request = {
        method: 'DELETE',
      }
      return fetch(`${this.apiEndpoint}/todos/${id}`, request)
        .then(resp => {
          return resp.json();
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(`### API Error! ${err}`);
        })
    } 
  }
}