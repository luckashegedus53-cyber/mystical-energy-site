const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.send('✅ Backend Mystical Energy rodando!');
});

// PRODUTOS
app.get('/api/products', async (req, res) => {
    const data = await fs.readFile('./data/products.json').catch(() => '[]');
    res.json(JSON.parse(data));
});

app.post('/api/products', async (req, res) => {
    const products = JSON.parse(await fs.readFile('./data/products.json').catch(() => '[]'));
    products.push({ id: Date.now(), ...req.body });
    await fs.writeFile('./data/products.json', JSON.stringify(products, null, 2));
    res.json({ ok: true });
});

// PEDIDOS
app.get('/api/orders', async (req, res) => {
    const data = await fs.readFile('./data/orders.json').catch(() => '[]');
    res.json(JSON.parse(data));
});

app.post('/api/orders', async (req, res) => {
    const orders = JSON.parse(await fs.readFile('./data/orders.json').catch(() => '[]'));
    orders.push({ id: Date.now(), ...req.body, date: new Date().toISOString() });
    await fs.writeFile('./data/orders.json', JSON.stringify(orders, null, 2));
    res.json({ ok: true });
});

// INICIAR
async function start() {
    await fs.mkdir('./data', { recursive: true });
    
    // Produtos padrão
    try { await fs.access('./data/products.json'); } catch {
        await fs.writeFile('./data/products.json', JSON.stringify([
            { id: 1, name: 'Lua de Lavanda', price: 24.90, status: 'ativo' },
            { id: 2, name: 'Sol de Citrinos', price: 26.90, status: 'ativo' },
            { id: 3, name: 'Escudo de Ervas', price: 29.90, status: 'ativo' },
            { id: 4, name: 'Coração de Rosa', price: 27.90, status: 'ativo' }
        ], null, 2));
    }
    
    app.listen(PORT, () => {
        console.log('=================================');
        console.log('✅ SERVIDOR RODANDO!');
        console.log('=================================');
        console.log('🌐 http://localhost:3000');
        console.log('=================================');
        console.log('📁 Servindo: ' + __dirname);
        console.log('=================================');
    });
}

start();
