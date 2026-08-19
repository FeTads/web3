const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/mensagem', (req, res) => {
    res.json({ texto: "Olá do Servidor!"})
})

app.get('/cep/:cep', async (req, res) => {
    const { cep } = req.params
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        res.json(data)

    } catch (error) {
        res.status(500).json({ error: "Erro de comunicação com VIACEP" })
    }
})

app.get('/cep/:cep/xml', async (req, res) => {
    const { cep } = req.params
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/xml/`)
        const data = await response.text()
        res.type('application/xml').send(data)

    } catch (error) {
        res.status(500).type('application/xml').send('<erro>Erro de comunicação com VIACEP</erro>')
    }
})

app.get('/cep/:uf/:cidade/:logradouro', async (req, res) => {
    const { uf, cidade, logradouro } = req.params
    try {
        const response = await fetch(`https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`)
        const data = await response.json()
        res.json(data)

    } catch (error) {
        res.status(500).json({ error: "Erro de comunicação com VIACEP" })
    }
})

app.get('/cep/:uf/:cidade/:logradouro/xml', async (req, res) => {
    const { uf, cidade, logradouro } = req.params
    try {
        const response = await fetch(`https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/xml/`)
        const data = await response.text()
        res.type('application/xml').send(data)

    } catch (error) {
        res.status(500).type('application/xml').send('<erro>Erro de comunicação com VIACEP</erro>')
    }
})

app.listen(3000)
