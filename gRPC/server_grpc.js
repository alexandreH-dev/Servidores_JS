const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = '../spotify.sqlite';
const PROTO_PATH = './spotify.proto';

// Carrega o arquivo .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).spotify;

// Função para consultar o banco
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

// Implementações dos métodos do serviço
const spotifyService = {
  ListarUsuarios: async (_, callback) => {
    try {
      const rows = await queryDB('SELECT * FROM Usuario');
      callback(null, { usuarios: rows });
      console.log("ListarUsuarios - 200");
    } catch (err) {
      console.log("ListarUsuarios - 500");
      callback(err);
    }
  },

  ListarMusicas: async (_, callback) => {
    try {
      const rows = await queryDB('SELECT * FROM Musica');
      callback(null, { musicas: rows });
      console.log("ListarMusicas - 200");
    } catch (err) {
      console.log("ListarMusicas - 500");
      callback(err);
    }
  },

  ListarPlaylistsPorUsuario: async ({ request }, callback) => {
    try {
      const rows = await queryDB('SELECT * FROM Playlist WHERE id_usuario = ?', [request.usuarioId]);
      callback(null, { playlists: rows });
      console.log("ListarPlaylistsPorUsuario - 200");
    } catch (err) {
      console.log("ListarPlaylistsPorUsuario - 500");
      callback(err);
    }
  },

  ListarMusicasPorPlaylist: async ({ request }, callback) => {
    try {
      const sql = `
        SELECT Musica.* FROM Musica
        JOIN Playlist_Musica ON Musica.id = Playlist_Musica.id_musica
        WHERE Playlist_Musica.id_playlist = ?
      `;
      const rows = await queryDB(sql, [request.playlistId]);
      callback(null, { musicas: rows });
      console.log("ListarMusicasPorPlaylist - 200");
    } catch (err) {
      console.log("ListarMusicasPorPlaylist - 500");
      callback(err);
    }
  },

  ListarPlaylistsPorMusica: async ({ request }, callback) => {
    try {
      const sql = `
        SELECT Playlist.* FROM Playlist
        JOIN Playlist_Musica ON Playlist.id = Playlist_Musica.id_playlist
        WHERE Playlist_Musica.id_musica = ?
      `;
      const rows = await queryDB(sql, [request.musicaId]);
      callback(null, { playlists: rows });
      console.log("ListarPlaylistsPorMusica - 200");
    } catch (err) {
      console.log("ListarPlaylistsPorMusica - 500");
      callback(err);
    }
  }
};

// Cria e inicia o servidor gRPC
function main() {
  const server = new grpc.Server();
  server.addService(proto.SpotifyService.service, spotifyService);
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC rodando em http://localhost:50051');
  });
}

main();
