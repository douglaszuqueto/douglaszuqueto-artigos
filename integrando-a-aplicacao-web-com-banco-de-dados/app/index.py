import sqlite3
from flask import Flask, render_template

debug = True
app   = Flask(__name__)

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
    return render_template('index.html', temperatures=getTemperature())

if __name__ == "__main__":
    if debug:
        app.run(host='0.0.0.0', port=80, debug=True)
    else:
        app.run(host='0.0.0.0', port=80)

