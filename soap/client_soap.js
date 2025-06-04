const soap = require('soap');

const url = 'http://localhost:8000/soap?wsdl';

// Exemplo de chamada aos métodos do serviço SOAP
soap.createClient(url, (err, client) => {
    if (err) {
        return console.error('Erro ao criar cliente SOAP:', err);
    }

    console.log('Cliente SOAP criado com sucesso!\n');

    // 1. Listar usuários
    client.listar_usuarios({}, (err, result) => {
        if (err) return console.error('Erro em listar_usuarios:', err);
        console.log(result)
        console.log('Usuários:', result.return);
    });

    // 2. Listar músicas
    client.listar_musicas({}, (err, result) => {
        if (err) return console.error('Erro em listar_musicas:', err);
        console.log('Músicas:', result.return);
    });

    // 3. Listar playlists de um usuário (substitua o ID conforme necessário)
    client.listar_playlists_usuario({ usuario_id: 1 }, (err, result) => {
        if (err) return console.error('Erro em listar_playlists_usuario:', err);
        console.log('Playlists do usuário 1:', result.return);
    });

    // 4. Listar músicas de uma playlist
    client.listar_musicas_playlist({ playlist_id: 1 }, (err, result) => {
        if (err) return console.error('Erro em listar_musicas_playlist:', err);
        console.log('Músicas da playlist 1:', result.return);
    });

    // 5. Listar playlists que contêm uma música
    client.listar_playlists_musica({ musica_id: 1 }, (err, result) => {
        if (err) return console.error('Erro em listar_playlists_musica:', err);
        console.log('Playlists que contêm a música 1:', result.return);
    });
});

