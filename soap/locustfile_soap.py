from locust import HttpUser, task, between

SOAP_HEADERS = {
    "Content-Type": "text/xml; charset=utf-8",
    "SOAPAction": ""
}

class SOAPUser(HttpUser):
    wait_time = between(1, 3)
    host = "http://localhost:8000"

    @task(1)
    def listar_usuarios(self):
        xml = """<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:spy="spyne.streaming.soap">
           <soapenv:Header/>
           <soapenv:Body>
              <spy:Listar_Usuarios/>
           </soapenv:Body>
        </soapenv:Envelope>"""
        self.client.post("/soap", data=xml, headers=SOAP_HEADERS, name="Listar_Usuarios")

    @task(1)
    def listar_musicas(self):
        xml = """<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:spy="spyne.streaming.soap">
           <soapenv:Header/>
           <soapenv:Body>
              <spy:Listar_Musicas/>
           </soapenv:Body>
        </soapenv:Envelope>"""
        self.client.post("/soap", data=xml, headers=SOAP_HEADERS, name="Listar_Musicas")

    @task(1)
    def listar_playlists_usuario(self):
        xml = """<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:spy="spyne.streaming.soap">
           <soapenv:Header/>
           <soapenv:Body>
              <spy:Listar_Playlist_Usuario>
                 <spy:id_usuario>1</spy:id_usuario>
              </spy:Listar_Playlist_Usuario>
           </soapenv:Body>
        </soapenv:Envelope>"""
        self.client.post("/soap", data=xml, headers=SOAP_HEADERS, name="Listar_Playlist_Usuario")

    @task(1)
    def listar_musicas_playlist(self):
        xml = """<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:spy="spyne.streaming.soap">
           <soapenv:Header/>
           <soapenv:Body>
              <spy:Listar_Musicas_Playlist>
                 <spy:id_playlist>1</spy:id_playlist>
              </spy:Listar_Musicas_Playlist>
           </soapenv:Body>
        </soapenv:Envelope>"""
        self.client.post("/soap", data=xml, headers=SOAP_HEADERS, name="Listar_Musicas_Playlist")

    @task(1)
    def listar_playlists_musica(self):
        xml = """<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:spy="spyne.streaming.soap">
           <soapenv:Header/>
           <soapenv:Body>
              <spy:Listar_Playlist_Musica>
                 <spy:id_musica>1</spy:id_musica>
              </spy:Listar_Playlist_Musica>
           </soapenv:Body>
        </soapenv:Envelope>"""
        self.client.post("/soap", data=xml, headers=SOAP_HEADERS, name="Listar_Playlist_Musica")