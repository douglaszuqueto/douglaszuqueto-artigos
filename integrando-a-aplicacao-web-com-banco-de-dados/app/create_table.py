import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE temperature (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        temperature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW
    );
""")

print('Tabela temperature criada com sucesso.')

conn.close()
