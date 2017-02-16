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
      1: 1,
      2: 0,
      3: 1,
      4: 0,
      5: 1,
      6: 0,
      7: 1,
      8: 0,
      9: 1
    }

    return jsonify(states)

if __name__ == "__main__":
    if debug:
        app.run(host='0.0.0.0', port=80, debug=True)
    else:
        app.run(host='0.0.0.0', port=80)

