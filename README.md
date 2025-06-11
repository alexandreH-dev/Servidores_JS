# SERVIDORES_JS

Este projeto tem como objetivo comparar diferentes abordagens de comunicação entre clientes e servidores utilizando as tecnologias: GraphQL, gRPC, REST e SOAP. Cada abordagem possui sua própria implementação de servidor, cliente e um teste de carga com Locust.

---

## 📦 Estrutura do Projeto
```
SERVIDORES_JS/
├── graphQL/
│ ├── client_graph.py
│ ├── locustfile_graphql.py
│ └── server_graph.js
├── gRPC/
│ ├── client_grpc.py
│ ├── locustfile_grpc.py
│ └── server_grpc.js
├── rest/
│ ├── client_rest.py
│ ├── locustfile_rest.py
│ └── server_rest.js
├── soap/
│ ├── client_soap.py
│ ├── locustfile_soap.py
│ └── server_soap.js
├── resultados_carga/
│ └── ... resultados dos testes de carga
├── package.json
├── spotify.sqlite
```

---

## ⚙️ Requisitos
- Node.js (v18+)
- Python (v3.8+)
- Locust (`pip install locust`)
- Instalar dependências com:
```bash
npm install
```