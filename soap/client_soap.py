from zeep import Client
import json

# URL do WSDL gerado pelo seu servidor Node.js
wsdl_url = "http://localhost:8000/soap?wsdl"

# Criação do cliente SOAP
client = Client(wsdl=wsdl_url)

# Chamada para Listar_Usuarios
print("Listar_Usuarios:")
usuarios = json.loads(client.service.Listar_Usuarios())
for item in usuarios:
  print(item)

# Chamada para Listar_Musicas
print("Listar_Musicas:", )
musicas = json.loads(client.service.Listar_Musicas())
for item in musicas:
  print(item)
  
# Chamada para Listar_Playlist_Usuario
print("Listar_Playlist_Usuario:", )
playlists = json.loads(client.service.Listar_Playlist_Usuario(id_usuario=1))
for item in playlists:
  print(item)
  
# Chamada para Listar_Musicas_Playlist
print("Listar_Musicas_Playlist:", )
musicas_play = json.loads(client.service.Listar_Musicas_Playlist(id_playlist=1))
for item in musicas_play:
  print(item)

# Chamada para Listar_Playlist_Musica
print("Listar_Playlist_Musica:", )
play_music = json.loads(client.service.Listar_Playlist_Musica(id_musica=1))
for item in play_music:
  print(item)

