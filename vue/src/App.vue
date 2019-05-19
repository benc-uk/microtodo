<template>
<v-app dark>
  <v-toolbar app dark color="blue darken-1">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title class="white--text"><v-icon>assignment</v-icon> Micro Todo</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn large icon @click="todoCreate">
      <v-icon large>add</v-icon>
    </v-btn>
    <v-btn large icon>
      <v-icon @click="refresh" large>refresh</v-icon>
    </v-btn>
    <!-- <v-btn large icon>
      <v-icon large>search</v-icon>
    </v-btn>
    <v-btn large icon>
      <v-icon large>delete</v-icon>
    </v-btn> -->
  </v-toolbar>

  <v-content>
    <v-container grid-list-lg>
      <v-layout column>
        <draggable v-model="todos" :sort="true">
          <transition-group name="todoAnim" tag="div">
            <todo v-for="todo in todos" :key="todo.id" :todo="todo" @todoUpdate="todoUpdate($event)" @todoDelete="todoDelete($event)">
            </todo>   
          </transition-group>
        </draggable>
      </v-layout>

      <v-card v-if="todos.length == 0">
        <v-card-title class="blue-grey lighten-3 black--text"><div class="title">No tasks!</div></v-card-title>
        <v-container text-xs-center>
          <v-layout justify-center row>
            <v-flex >
              <v-btn large @click="todoCreate" color="success"><v-icon>add</v-icon> &nbsp; NEW TASK</v-btn>
            </v-flex>
          </v-layout>
        </v-container>        
      </v-card>

    </v-container>
  </v-content>

  <v-footer app> &nbsp; Micro Todo {{ version }}</v-footer>
</v-app>
</template>

<script>
import Todo from './components/Todo'
import apiMixin from "../mixins/api.js"
import draggable from "vuedraggable"
import _ from 'lodash'
import packageJson from '../package.json'
var interval

export default {
  name: 'App',

  components: {
    Todo, draggable
  },

  mixins: [ apiMixin ],

  data() {
    return {
      todos: null,
      updateQueue: {},
      version: packageJson.version
    }
  },

  computed: {
    orderedTodos: {
      get() { return _.orderBy(this.todos, ['id'], ['desc']) },
      set(v) { this.todos = v }
    }
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
        title: "New todo", notes: "", star: false, done: false, type: ""
      }
      this.apiPostTodo(newTodo)
      .then(result => { 
        this.todos.unshift(result)
      })
    },

    refresh() {
      this.apiGetTodos()
        .then(result => this.todos = result)
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
  position: absolute;
  width: 100%
}
.todoAnim-enter, .todoAnim-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.todoAnim-move {
  transition: transform 1s;
}
</style>
