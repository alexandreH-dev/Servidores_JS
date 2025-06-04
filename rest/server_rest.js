const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const DB_PATH = '../spotify.sqlite'; // caminho para seu banco SQLite

// Função para executar queries
function queryDB(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Rota: listar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const data = await queryDB('SELECT * FROM Usuario');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: listar todas as músicas
app.get('/musicas', async (req, res) => {
  try {
    const data = await queryDB('SELECT * FROM Musica');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: listar playlists de um usuário
app.get('/playlists/usuario/:id_usuario', async (req, res) => {
  const id_usuario = req.params.id_usuario;
  try {
    const data = await queryDB('SELECT * FROM Playlist WHERE id_usuario = ?', [id_usuario]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: listar músicas de uma playlist
app.get('/musicas/playlist/:id_playlist', async (req, res) => {
  const id_playlist = req.params.id_playlist;
  const sql = `
    SELECT Musica.* FROM Musica
    JOIN Playlist_Musica ON Musica.id = Playlist_Musica.id_musica
    WHERE Playlist_Musica.id_playlist = ?
  `;
  try {
    const data = await queryDB(sql, [id_playlist]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: listar playlists que possuem uma música específica
app.get('/playlists/musica/:id_musica', async (req, res) => {
  const id_musica = req.params.id_musica;
  const sql = `
    SELECT Playlist.* FROM Playlist
    JOIN Playlist_Musica ON Playlist.id = Playlist_Musica.id_playlist
    WHERE Playlist_Musica.id_musica = ?
  `;
  try {
    const data = await queryDB(sql, [id_musica]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicializa o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
