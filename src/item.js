// Importando o Mongoose
const mongoose = require('mongoose');

// Definindo o esquema para uma tarefa na To-Do List
const todoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true, // Campo obrigatório
    trim: true, // Remove espaços extras no início e no final
    maxlength: 200, // Limita o tamanho da string a 200 caracteres
  },
  dueDate: {
    type: Date,
    required: true, // Campo obrigatório
  },
});

// Criando o modelo baseado no esquema
const Todo = mongoose.model('Todo', todoSchema);

// Exportando o modelo
module.exports = Todo;
