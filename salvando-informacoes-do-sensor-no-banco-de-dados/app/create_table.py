import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE temperature (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        temperature TEXT NOT NULL,
        created_at DATE NOT NULL
    );
""")

print('Tabela ´temperature´ criada com sucesso.')

conn.close()
