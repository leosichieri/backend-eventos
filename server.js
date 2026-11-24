
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();

app.set('json spaces', 2);

app.use(cors());
app.use(express.json());

// Conexão com o Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Rota inicial para verificar o servidor
app.get('/', (req, res) => {
    res.send('API de Eventos Acadêmicos funcionando!');
});

// Listar eventos
app.get('/eventos', async (req, res) => {
    const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        return res.status(500).json({ erro: error.message });
    }

    res.json(data);
});

// Cadastrar evento
app.post('/eventos', async (req, res) => {
    const { titulo, descricao, data_evento, local } = req.body;

    if (!titulo || !data_evento || !local) {
        return res.status(400).json({
            erro: 'Preencha título, data e local.'
        });
    }

    const { data, error } = await supabase
        .from('eventos')
        .insert([{ titulo, descricao, data_evento, local }])
        .select();

    if (error) {
        return res.status(500).json({ erro: error.message });
    }

    res.status(201).json(data);
});

// Porta do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
