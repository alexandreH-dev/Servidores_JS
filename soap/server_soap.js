const http = require('http');
const soap = require('strong-soap').soap;
const fs = require('fs');
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
            Listar_Usuarios: function (args, callback) {
                console.log("listar_usuarios");
                executarConsulta("SELECT * FROM Usuario")
                    .then((res) => {
                        const objetos = res.map(JSON.parse);
                        console.log(objetos);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        result = "Erro na requisição"
                        callback({ result });
                    })
            },
            Listar_Musicas: function (args, callback) {
                console.log("listar_musicas");
                executarConsulta("SELECT * FROM Musica")
                    .then((res) => {
                        const objetos = res.map(JSON.parse);
                        console.log(objetos);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        result = "Erro na requisição"
                        callback({ result });
                    })
            },
            Listar_Playlist_Usuario: function (args, callback) {
                const { id_usuario } = args;
                console.log("listar_playlist_usuario");
                console.log(`ID - ${id_usuario}`);

                executarConsulta("SELECT * FROM Playlist WHERE id_usuario = ?", [id_usuario])
                    .then((res) => {
                        const objetos = res.map(JSON.parse);
                        console.log(objetos);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        result = "Erro na requisição"
                        callback({ result });
                    })
            },
            Listar_Musicas_Playlist: function (args, callback) {
                const { id_playlist } = args;
                console.log("listar_musicas_playlist");
                console.log(`ID - ${id_playlist}`);
                const sql = `
                    SELECT Musica.* FROM Musica
                    JOIN Playlist_Musica ON Musica.id = Playlist_Musica.id_musica
                     WHERE Playlist_Musica.id_playlist = ?
                    `;

                executarConsulta(sql, [id_playlist])
                    .then((res) => {
                        const objetos = res.map(JSON.parse);
                        console.log(objetos);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
                        result = "Erro na requisição"
                        callback({ result });
                    })
            },
            Listar_Playlist_Musica: function (args, callback) {
                const { id_musica } = args;
                console.log("listar_playlist_musica");
                console.log(`ID - ${id_musica}`);
                const sql = `
                    SELECT Playlist.* FROM Playlist
                    JOIN Playlist_Musica ON Playlist.id = Playlist_Musica.id_playlist
                    WHERE Playlist_Musica.id_musica = ?
                    `;

                executarConsulta(sql, [id_musica])
                    .then((res) => {
                        const objetos = res.map(JSON.parse);
                        console.log(objetos);
                        const jsonString = JSON.stringify(objetos);
                        result = jsonString
                        callback({ result });
                    })
                    .catch(() => {
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
    console.log('SOAP server listening on port 8000');
    const soapServer = soap.listen(server, '/soap', service, wsdl);;
});