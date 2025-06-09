from locust import HttpUser, task, between

class GraphQLUser(HttpUser):
    wait_time = between(1, 3)
    host = "http://localhost:4000"

    @task(1)
    def listar_usuarios(self):
        query_usuarios = """
            query {
                usuarios {
                    id
                    nome
                    idade
             }
            }
        """
        self.client.post("/graphql", json={'query': query_usuarios, 'variables': None}, name="usuarios")

    @task(1)
    def listar_musicas(self):
        query_musicas = """
            query {
                musicas {
                    id
                    nome
                    artista
                }
            }
            """
        self.client.post("/graphql", json={'query': query_musicas, 'variables': None}, name="musicas")

    @task(1)
    def listar_playlists_usuario(self):
        query_playlists_usuario = """
            query ($id: Int!) {
                playlistsUsuario(usuarioId: $id) {
                    id
                    nome
                }
            }
        """
        self.client.post("/graphql", json={'query': query_playlists_usuario, 'variables': {"id": 1}}, name="playlists_usuario")

    @task(1)
    def listar_musicas_playlist(self):
        query_musicas_playlist = """
            query ($id: Int!) {
                musicasPlaylist(playlistId: $id) {
                    id
                    nome
                }
            }
        """
        self.client.post("/graphql", json={'query': query_musicas_playlist, 'variables': {"id": 1}}, name="musicas_playlist")

    @task(1)
    def listar_playlists_musica(self):
        query_playlists_musica = """
            query ($id: Int!) {
                playlistsMusica(musicaId: $id) {
                    id
                    nome
                }
            }
        """
        self.client.post("/graphql", json={'query': query_playlists_musica, 'variables': {"id": 1}}, name="playlists_musica")
