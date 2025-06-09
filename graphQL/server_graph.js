// npm install express express-graphql graphql sqlite3
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = '../spotify.sqlite';

// Função auxiliar para consultar o banco
function queryDB(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Schema GraphQL
const schema = buildSchema(`
  type Usuario {
    id: Int
    nome: String
    idade: Int
  }

  type Musica {
    id: Int
    nome: String
    artista: String
  }

  type Playlist {
    id: Int
    nome: String
    id_usuario: Int
  }

  type Query {
    usuarios: [Usuario]
    musicas: [Musica]
    playlistsUsuario(usuarioId: Int!): [Playlist]
    musicasPlaylist(playlistId: Int!): [Musica]
    playlistsMusica(musicaId: Int!): [Playlist]
  }
`);

// Resolvers
const root = {
  usuarios: () => {
    console.log("usuarios");
    return queryDB('SELECT * FROM Usuario');
  },

  musicas: () => {
    console.log("musicas");
    return queryDB('SELECT * FROM Musica')
  },

  playlistsUsuario: ({ usuarioId }) => {
    console.log("playlistsUsuario");
    return queryDB('SELECT * FROM Playlist WHERE id_usuario = ?', [usuarioId])
  },

  musicasPlaylist: ({ playlistId }) => {
    console.log("musicasPlaylist");
    return queryDB(`
      SELECT Musica.* FROM Musica
      JOIN Playlist_Musica ON Musica.id = Playlist_Musica.id_musica
      WHERE Playlist_Musica.id_playlist = ?
    `, [playlistId]);
  },

  playlistsMusica: ({ musicaId }) => {
    console.log("playlistsMusica");
    return queryDB(`
      SELECT Playlist.* FROM Playlist
      JOIN Playlist_Musica ON Playlist.id = Playlist_Musica.id_playlist
      WHERE Playlist_Musica.id_musica = ?
    `, [musicaId])
  }
};

// Inicializa o servidor Express + GraphQL
const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true, // Interface interativa no navegador
}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor GraphQL rodando em http://localhost:${PORT}/graphql`);
});

