// SOAP
const soap = require('strong-soap').soap;

const url = 'http://localhost:8000/soap?wsdl';

const requestArgs = {
  a: 1,
  b: 7
};

const id_user = {
  id_usuario: 1
};
const id_play = {
  id_playlist: 1
};
const id_music = {
  id_musica: 1
};

soap.createClient(url, {}, (err, client) => {
  if (err) {
    return console.error('Erro ao criar cliente SOAP:', err);
  }

  client.Listar_Usuarios((err, result) => {
    if (err) {
      console.error('Erro na chamada SOAP:', err);
    } else {
      console.log('Resultado - Listar_Usuarios:\n', JSON.parse(result.result));
    }
  });

  client.Listar_Musicas((err, result) => {
    if (err) {
      console.error('Erro na chamada SOAP:', err);
    } else {
      console.log('Resultado - Listar_Musicas:\n', JSON.parse(result.result));
    }
  });

  client.Listar_Playlist_Usuario(id_user, (err, result) => {
    if (err) {
      console.error('Erro na chamada SOAP:', err);
    } else {
      console.log('Resultado - Listar_Playlist_Usuario:\n', JSON.parse(result.result));
    }
  });

  client.Listar_Musicas_Playlist(id_play, (err, result) => {
    if (err) {
      console.error('Erro na chamada SOAP:', err);
    } else {
      console.log('Resultado - Listar_Musicas_Playlist:\n', JSON.parse(result.result));
    }
  });

  client.Listar_Playlist_Musica(id_music, (err, result) => {
    if (err) {
      console.error('Erro na chamada SOAP:', err);
    } else {
      console.log('Resultado - Listar_Playlist_Musica:\n', JSON.parse(result.result));
    }
  });
});