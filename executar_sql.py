import sqlite3

# Conecta ao banco de dados
conn = sqlite3.connect('spotify.sqlite')
cursor = conn.cursor()

# Script de inserção
# insert_query = """
# INSERT INTO Usuario (nome, idade) VALUES
# ('Alice', 25), ('Bruno', 30), ('Carla', 22), ('Daniel', 28), ('Elaine', 35),
# ('Fernando', 27), ('Gabriela', 24), ('Henrique', 31), ('Isabela', 26), ('João', 29),
# ('Karla', 23), ('Leonardo', 32), ('Marina', 21), ('Nicolas', 34), ('Olivia', 20),
# ('Paulo', 33), ('Quezia', 22), ('Rafael', 30), ('Sabrina', 28), ('Thiago', 27);
# """

# # Executa 100 vezes
# for _ in range(100):
#     cursor.execute(insert_query)

cursor.execute("SELECT COUNT(*) FROM Usuario")

# Obtendo o resultado
quantidade = cursor.fetchone()[0]

# Mostrando o resultado
print(f"Número de registros: {quantidade}")

# Salva alterações e fecha a conexão
conn.commit()
conn.close()