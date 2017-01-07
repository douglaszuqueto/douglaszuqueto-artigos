# importa os pacotes
from flask import Flask, render_template

# instancia o flask
app = Flask(__name__)

# define uma rota, neste caso a rota raiz
@app.route('/')
def index():
    # render_template como o nome ja diz, ira renderizar nosso index.html
    return render_template('index.html')

if __name__ == "__main__":
    # inicia a aplicacao
    # 2 parametros sao passados, host e port
    # host = seu ip, neste caso sera 0.0.0.0 pois rodara em todas interfaces de rede
    # port = porta que sera usada, neste caso iremos rodar na porta 80
    app.run(host='0.0.0.0', port=80)
