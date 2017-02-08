import sqlite3
from flask import Flask, render_template

debug = True
app   = Flask(__name__)

# funcao responsavel por efetuar a leitura do banco de dados e nos retornar as temperaturas cadastradas
def getTemperature():
    conn   = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, temperature, strftime('%d/%m/%Y %H:%M:%S', created_at) as created_at FROM temperature
        ORDER BY id DESC
        LIMIT 50;
    """)

    return cursor.fetchall()

    conn.close()

@app.route('/')
def index():
    # veja que abaixo passamos um atributo 'temperatures' no metodo render_template
    # isso nada mais e que estamos passando as temperaturas recuperadas para nosso html
    # para que depois se possa mostrar os dados na tabela
    return render_template('index.html', temperatures=getTemperature())

if __name__ == "__main__":
    if debug:
        app.run(host='0.0.0.0', port=80, debug=True)
    else:
        app.run(host='0.0.0.0', port=80)

