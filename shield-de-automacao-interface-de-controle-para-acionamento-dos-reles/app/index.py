from flask import Flask, render_template, jsonify

debug = True
app   = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/states')
def states():
    states = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0
    }

    return jsonify(states)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=debug)

