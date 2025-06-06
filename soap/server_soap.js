const fs = require('fs');
const http = require('http');
const soap = require('strong-soap').soap;
const sqlite3 = require('sqlite3').verbose();

// Lê o WSDL
const wsdl = fs.readFileSync('service.wsdl', 'utf8');
const dbPath = '../spotify.sqlite';

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

// Serviço SOAP
const service = {
    SpotifyService: {
        SpotifyPort: {
            Listar_Usuarios: function (_, callback) {
                executarConsulta("SELECT * FROM Usuario")
                    .then((res) => {
                        console.log("Listar_Usuarios - Status Code 200");
                        const objetos = res.map(JSON.parse);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        console.log("Listar_Usuarios - Status Code 500");
                        result = "Erro na requisição"
                        callback({ result });
                    })
            },
            Listar_Musicas: function (_, callback) {
                executarConsulta("SELECT * FROM Musica")
                    .then((res) => {
                        console.log("Listar_Musicas - Status Code 200");
                        const objetos = res.map(JSON.parse);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        console.log("Listar_Musicas - Status Code 500");
                        result = "Erro na requisição"
                        callback({ result });
                    })
            },
            Listar_Playlist_Usuario: function (args, callback) {
                const { id_usuario } = args;
                executarConsulta("SELECT * FROM Playlist WHERE id_usuario = ?", [id_usuario])
                    .then((res) => {
                        console.log("Listar_Playlist_Usuario - Status Code 200");
                        const objetos = res.map(JSON.parse);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        console.log("Listar_Playlist_Usuario - Status Code 500");
                        result = "Erro na requisição"
                        callback({ result });
                    })
            },
            Listar_Musicas_Playlist: function (args, callback) {
                const { id_playlist } = args;
                const sql = `
                    SELECT Musica.* FROM Musica
                    JOIN Playlist_Musica ON Musica.id = Playlist_Musica.id_musica
                     WHERE Playlist_Musica.id_playlist = ?
                    `;
                executarConsulta(sql, [id_playlist])
                    .then((res) => {
                        console.log("Listar_Musicas_Playlist - Status Code 200");
                        const objetos = res.map(JSON.parse);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        console.log("Listar_Musicas_Playlist - Status Code 500");
                        result = "Erro na requisição"
                        callback({ result });
                    })
            },
            Listar_Playlist_Musica: function (args, callback) {
                const { id_musica } = args;
                const sql = `
                    SELECT Playlist.* FROM Playlist
                    JOIN Playlist_Musica ON Playlist.id = Playlist_Musica.id_playlist
                    WHERE Playlist_Musica.id_musica = ?
                    `;
                executarConsulta(sql, [id_musica])
                    .then((res) => {
                        console.log("Listar_Playlist_Musica - Status Code 200");
                        const objetos = res.map(JSON.parse);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        console.log("Listar_Playlist_Musica - Status Code 500");
                        result = "Erro na requisição"
                        callback({ result });
                    })
            }
        }
    }
};

const server = http.createServer(function (_, res) {
    res.end('404: Not Found');
});

server.listen(8000, function () {
    console.log('SOAP server listening on http://localhost:8000/soap?wsdl');
    const soapServer = soap.listen(server, '/soap', service, wsdl);;
});