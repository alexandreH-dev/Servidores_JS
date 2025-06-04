async function callSoapService(xmlString, soapAction) {
  const url = "http://localhost:8000/soap";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      "SOAPAction": soapAction,
    },
    body: xmlString,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseText = await response.text();
  return responseText;
}

function buildEnvelope(operation, params = {}) {
  const ns = 'http://example.com/spotify';
  let paramsXml = '';

  for (const [key, value] of Object.entries(params)) {
    paramsXml += `<${key}>${value}</${key}>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:sp="${ns}">
  <soapenv:Header/>
  <soapenv:Body>
    <sp:${operation}>
      ${paramsXml}
    </sp:${operation}>
  </soapenv:Body>
</soapenv:Envelope>`;
}

// Funções para cada operação:

async function listar_usuarios() {
  const xml = buildEnvelope("listar_usuarios");
  return callSoapService(xml, "listar_usuarios");
}

async function listar_musicas() {
  const xml = buildEnvelope("listar_musicas");
  return callSoapService(xml, "listar_musicas");
}

async function listar_playlists_usuario(usuario_id) {
  const xml = buildEnvelope("listar_playlists_usuario", { usuario_id });
  return callSoapService(xml, "listar_playlists_usuario");
}

async function listar_musicas_playlist(playlist_id) {
  const xml = buildEnvelope("listar_musicas_playlist", { playlist_id });
  return callSoapService(xml, "listar_musicas_playlist");
}

async function listar_playlists_musica(musica_id) {
  const xml = buildEnvelope("listar_playlists_musica", { musica_id });
  return callSoapService(xml, "listar_playlists_musica");
}

// Exemplo de uso:
(async () => {
  try {
    let response;

    response = await listar_usuarios();
    console.log("listar_usuarios response:", response);

    response = await listar_musicas();
    console.log("listar_musicas response:", response);

    response = await listar_playlists_usuario(1);
    console.log("listar_playlists_usuario(1) response:", response);

    response = await listar_musicas_playlist(2);
    console.log("listar_musicas_playlist(2) response:", response);

    response = await listar_playlists_musica(3);
    console.log("listar_playlists_musica(3) response:", response);

  } catch (err) {
    console.error("Erro na chamada SOAP:", err);
  }
})();
