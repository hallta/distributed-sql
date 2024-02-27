from flask import Flask, abort,request, redirect
import json
import sqlite3

app = Flask(__name__)


@app.errorhandler(404)
def not_found(e):
    return "🤷‍♂️"


@app.route("/sql/1/get", methods=['POST'])
def get():
    data = request.json

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(data['sql'])
    return json.dumps(cur.fetchall())



@app.route("/sql/1/put", methods=['POST'])
def put():
    data = request.json
    cur = db.cursor()
    cur.execute(data['sql'], data['params'])

    db.commit()
    prepare_db()

#   if path in redir_map:
#       return redirect("https://" + redir_map[path], code=302)
#   else:
#       abort(404)


"""
@app.route('/save')
def save():
    path = request.args.get('p')
    url = request.args.get('u')
    redir_map[path] = url

    config = open('config', 'a')
    config.write(path + ':' + url + "\n")
    config.close()

    return "👍"
"""

def validate_config(config):
    """
    Will validate the loaded configuration file.

    @type  config: object
    @param config: The loaded JSON config as a Py type

    @rtype:  boolean
    @return: Will return True or False

    {
        "sink": []
    }
    """
    return (
        """
        By default, the service will store data locally. If there
        are sinks, it will also forward to those sinks.
        """
        "sink" not in config or isinstance(config['sink'], list) 
    )


def load_config():
    config = json.loads(open("config.json", "r").read())
    validate_config(config)


def get_conn(conn = None):
    if conn and conn is not None:
        conn.close()
    return sqlite3.connect('main.db')


def startup():
    load_config()

startup()