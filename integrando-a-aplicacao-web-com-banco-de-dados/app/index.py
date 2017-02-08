# importa os pacotes
import sqlite3
from flask import Flask, render_template

# instancia o flask
app = Flask(__name__)

def getTemperature():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, temperature, strftime('%d/%m/%Y %H:%M:%S', created_at) as created_at FROM temperature
        ORDER BY id DESC
        LIMIT 50;
    """)

    return cursor.fetchall()

    conn.close()

# define uma rota, neste caso a rota raiz
@app.route('/')
def index():
    # render_template como o nome ja diz, ira renderizar nosso index.html
    return render_template('index.html', temperatures=getTemperature())

if __name__ == "__main__":
    # inicia a aplicacao
    # 2 parametros sao passados, host e port
    # host = seu ip, neste caso sera 0.0.0.0 pois rodara em todas interfaces de rede
    # port = porta que sera usada, neste caso iremos rodar na porta 80
    app.run(host='0.0.0.0', port=80)
