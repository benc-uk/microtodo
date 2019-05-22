<template>
<v-app dark>
  <v-toolbar app dark color="blue darken-1">
    <v-toolbar-title class="white--text"><v-icon>assignment</v-icon> Micro Todo</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn large icon @click="todoCreate">
      <v-icon large>add</v-icon>
    </v-btn>

    <v-btn large icon>
      <v-icon @click="refresh" large>refresh</v-icon>
    </v-btn>

    <v-btn large icon>
      <v-icon @click="showSettings = true" large>settings</v-icon>
    </v-btn>    
  </v-toolbar>

  <v-content>
    <v-container grid-list-lg>
      <v-layout column>
        <!-- <draggable v-model="todos" :sort="true"> -->
          <transition-group name="todoAnim" tag="div">
            <todo v-for="todo in orderedTodos" :key="todo.id" :todo="todo" @todoUpdate="todoUpdate($event)" @todoDelete="todoDelete($event)">
            </todo>   
          </transition-group>
        <!-- </draggable> -->
      </v-layout>

      <div v-if="todos && todos.length == 0" class="text-xs-center">
        <v-btn large @click="todoCreate" color="success" >NEW TASK</v-btn>
      </div>

      <!-- error display -->
      <v-alert v-if="error" :value="true" type="error">
        <div class="title">API Error</div> <br> {{ error }}
      </v-alert>

      <!-- settings -->
      <v-dialog v-model="showSettings" persistent max-width="600px">
        <div class="blue-grey darken-4 pa-1">
          <div class="info text-xs-center pa-3 headline">SETTINGS</div>
          <v-text-field autofocus hint="Use a full URL e.g. <b>http://foo/api</b> or a path, e.g. <b>/api</b>. Do not include a trailing slash!" label="API Endpoint" class="pa-3" v-model="apiEndpoint" color="light-blue"></v-text-field>
          <p class="text-xs-center "><v-btn color="green" large @click="refresh(); showSettings = false"> OK </v-btn></p>
        </div>
      </v-dialog>
  
      <!-- Loading spinner -->
      <v-dialog :value="!todos && !error" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>Loading data from API<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

    </v-container>
  </v-content>
  <v-footer app> &nbsp; Micro Todo {{ version }}</v-footer>
  <v-btn fixed dark fab bottom right color="green" app @click="todoCreate"> <v-icon>add</v-icon> </v-btn>
</v-app>
</template>

<script>
import Todo from './components/Todo'
import apiMixin from "./mixins/api.js"
import lodash from 'lodash'
import packageJson from '../package.json'
var interval

export default {
  name: 'App',

  components: {
    Todo //, draggable
  },

  mixins: [ apiMixin ],

  data() {
    return {
      todos: null,
      updateQueue: {},
      version: packageJson.version,
      error: null,
      showSettings: false,
      apiEndpoint: process.env.VUE_APP_API_ENDPOINT
    }
  },

  computed: {
    orderedTodos() { return lodash.orderBy(this.todos, ['id'], ['desc']) }
  },

  methods: {
    todoUpdate(todo) {
      this.updateQueue[todo.id] = todo
    },

    todoDelete(todo) {
      let ix = this.todos.findIndex(t => t.id == todo.id)
      this.todos.splice(ix, 1)
      this.apiDeleteTodo(todo.id)
    },

    todoCreate() {
      let newTodo = {
        title: "", notes: "", star: false, done: false, type: "", modified: null
      }
      this.apiPostTodo(newTodo)
      .then(result => { 
        this.todos.unshift(result)
      })
    },

    refresh() {
      this.todos = null
      this.error = null
      this.updateQueue = {}
      this.apiGetTodos()
      .then(result => this.todos = result)
      .catch(err => this.error = err)
    }
  },

  mounted() {
    this.refresh()

    interval = setInterval(() => {
      for(let id in this.updateQueue) {
        let todo = this.updateQueue[id]
        delete this.updateQueue[id]
        if(!todo.title || todo.length == 0) continue
        this.apiPutTodo(id, todo)
      }
    }, 3000)
  },

  destroyed() {
    clearInterval(interval);
  }
}
</script>

<style>
.todoAnim-enter-active, .todoAnim-leave-active  {
  transition: all .6s ease;
}
.todoAnim-leave-active {
  transition: all .4s ease;
  position: fixed;
  /* width: 80% */
}
.todoAnim-enter, .todoAnim-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.todoAnim-move {
  transition: transform 1s;
}
</style>
