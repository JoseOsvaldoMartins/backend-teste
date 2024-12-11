require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Todo = require('./src/item');
const User = require('./src/user');
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

// Conexão com Mongo Atlas
mongoose
  .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota para criar um novo To-Do
app.post('/todos', async (req, res) => {
  try {
    const { description, dueDate } = req.body;

    // Validações básicas
    if (!description || !dueDate) {
      return res.status(400).json({ message: 'Description and dueDate are required.' });
    }

    // Criação do novo To-Do
    const newTodo = new Todo({ description, dueDate });
    await newTodo.save();
    res.status(201).json({ message: 'Todo created successfully!', todo: newTodo });
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo.', error: error.message });
  }
});

// Rota para deletar um To-Do por ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Tenta encontrar e deletar o To-Do
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    res.status(200).json({ message: 'Todo deleted successfully!', todo: deletedTodo });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo.', error: error.message });
  }
});


// Rota para listar todos os To-Dos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find(); // Busca todos os To-Dos no banco de dados
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving todos.', error: error.message });
  }
});

// Rota para token
app.get('/token', (req, res) => {
  //operador opcional ? so executa o dodigo a seguir se for true
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer token"

  if (!token) return res.status(403).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.json({ message: `${decoded.username}!` });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
});


// Rota de login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;        //recebe os parametros da requisiçao 
    const user = await User.findOne({ username }); //encontra usuario no banco de dados e retorna os dados login e senha(criptografada)
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido!', token });
  } catch (err) {
    console.log('error login');
    res.status(500).json({ error: err.message });
  }
});

/* // teste de rotas
app.get('/path/:teste', async (req, res) =>{

  const pathValue = req.params.teste;
  console.log('path : ' + pathValue);
  return;
});

app.get('/query', async(req, res) =>{

  const {testequery01 , testequery02} = req.query;
  console.log('Query : ' + testequery01 + ' ' + testequery02);
  return;
});

app.post('/body', async(req, res) =>{

  const {bodyValue1, bodyValue2} = req.body;
  console.log('Body : ' + bodyValue1+' ' + bodyValue2);
});

app.get('/headers', (req, res) =>{
  const headersValue = req.headers.authorization;
  console.log('Headers : ' + headersValue);
  return;
}); */

app.get('/teste', async (req, res) => {
  res.json({ message: 'Teste bem-sucedido!'});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});