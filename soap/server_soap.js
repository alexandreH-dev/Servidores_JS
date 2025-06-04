const express = require('express');
const fs = require('fs');
const http = require('http');
const soap = require('soap');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 8000;

// Lê o WSDL
const wsdl = fs.readFileSync('service.wsdl', 'utf8');
const dbPath = '../spotify.sqlite';

// Função utilitária para executar consultas
function executarConsulta(query, params = []) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) return reject(err);
        });

        db.all(query, params, (err, rows) => {
            if (err) return reject(err);
            db.close();
            resolve(rows.map(row => JSON.stringify(row)));
        });
    });
}

// Implementação dos métodos SOAP
// Serviço SOAP
const service = {
    StreamingService: {
        StreamingServiceSoap: {
            listar_usuarios(args, callback) {
              console.log("AQUIIIIIIIIIIIII")
                executarConsulta("SELECT * FROM Usuario")
                    .then(res => callback({ listar_usuariosResult: res }))
                    .catch(err => callback({ listar_usuariosResult: [`Erro: ${err.message}`] }));
            },
            listar_musicas(args, callback) {
                executarConsulta("SELECT * FROM Musica")
                    .then(res => callback({ return: res }))
                    .catch(err => callback({ return: [`Erro: ${err.message}`] }));
            },
            listar_playlists_usuario(args, callback) {
                const { usuario_id } = args;
                executarConsulta("SELECT * FROM Playlist WHERE id_usuario = ?", [usuario_id])
                    .then(res => callback({ return: res }))
                    .catch(err => callback({ return: [`Erro: ${err.message}`] }));
            },
            listar_musicas_playlist(args, callback) {
                const { playlist_id } = args;
                const query = `
                    SELECT m.ID, m.Nome, m.Artista
                    FROM Musica m
                    JOIN Playlist_Musica pm ON m.ID = pm.id_musica
                    WHERE pm.id_playlist = ?
                `;
                executarConsulta(query, [playlist_id])
                    .then(res => callback({ return: res }))
                    .catch(err => callback({ return: [`Erro: ${err.message}`] }));
            },
            listar_playlists_musica(args, callback) {
                const { musica_id } = args;
                const query = `
                    SELECT p.ID, p.Nome, p.id_usuario
                    FROM Playlist p
                    JOIN Playlist_Musica pm ON p.ID = pm.id_playlist
                    WHERE pm.id_musica = ?
                `;
                executarConsulta(query, [musica_id])
                    .then(res => callback({ return: res }))
                    .catch(err => callback({ return: [`Erro: ${err.message}`] }));
            }
        }
    }
};

// Cria o servidor HTTP com Express
const server = http.createServer(app);

// Adiciona o SOAP na rota /soap
soap.listen(server, '/soap', service, wsdl);

server.listen(port, () => {
  console.log(`Servidor SOAP rodando em http://localhost:${port}/soap?wsdl`);
});
