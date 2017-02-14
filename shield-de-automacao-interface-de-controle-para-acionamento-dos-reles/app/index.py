from flask import Flask, render_template

debug = True
app   = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    if debug:
        app.run(host='0.0.0.0', port=80, debug=True)
    else:
        app.run(host='0.0.0.0', port=80)

