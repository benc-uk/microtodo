<template>

  <v-flex >
    <v-card>
      <!-- <v-card-title :class="titleColour"  @dblclick="todo.done = !todo.done"><v-text-field v-model="todo.title" solo outline></v-text-field></v-card-title> -->
      <div :class="titleColour" class="headline" style="padding-left:1rem; padding-right:1rem">
        <v-text-field @focus="$event.target.select()" :disabled="todo.done" style="font-size:100%" :rules="[rules.required]" placeholder="Title for task or todo" :ref="`title_`+todo.id" color="white" v-model="todo.title"></v-text-field>
      </div>

      <v-card-text>
        <v-layout>
          <v-textarea :disabled="todo.done" prepend-icon="insert_comment" auto-grow rows="1"
            label="Notes" color="light-blue" v-model="todo.notes">
            <v-spacer></v-spacer>
          </v-textarea>
        </v-layout>
      </v-card-text>

      <v-card-actions class="pl-4">
        <v-switch label="COMPLETED" v-model="todo.done"></v-switch>
        <v-btn large flat icon :disabled="todo.done" :color="starColour" @click="todo.star = !todo.star"><v-icon large>star</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-combobox v-model="todo.type" :items="types" chips label="Category" :disabled="todo.done"></v-combobox>
        <v-spacer></v-spacer>
        <v-btn large flat icon @click="$emit('todoDelete', todo)" ><v-icon color="red lighten-2">delete</v-icon></v-btn>
      </v-card-actions>

    </v-card>
  </v-flex>

</template>

<script>
export default {
  props: ['todo', 'isNew'],

  data () {
    return {
      rules: {
        required: value => !!value || 'Required.'
      },
      types: ["Task", "Idea", "Reminder", "To Buy", "Note"]
    }
  },

  methods: {
  },

  computed: {
    titleColour: function() {
      if(!this.todo.title || this.todo.length == 0) return 'grey darken-4'
      return this.todo.done ? 'blue-grey' : 'success'
    },

    starColour: function() {
      return this.todo.star ? 'amber' : 'grey'
    }
  },

  mounted() {
    if(!this.todo.modified) {
      this.$refs[`title_${this.todo.id}`].focus()
    }    
  },

  updated() { 
    this.todo.modified = new Date().toISOString()
    this.$emit('todoUpdate', this.todo)
  }
}
</script>

