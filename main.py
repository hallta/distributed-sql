from flask import Flask, abort, request, Response

import json
import os
import requests
import sqlite3

app = Flask(__name__)
config = {}


@app.errorhandler(404)
def not_found(e):
    return "🤷‍♂️"


@app.route("/", methods=['GET'])
def home(path = 'index.html'):
    root = os.path.abspath(os.path.dirname(__file__))
    src = os.path.join(root, 'www/{}'.format(path))

    if os.path.isfile(src):
        return open(src).read()
    else:
        return abort(404)


@app.route("/<string:path>")
def files(path):
    return home(path)


@app.route("/sql/1/get", methods=['POST'])
def get():
    data = request.json

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(data['sql'])

    res = as_response(cur.fetchall())

    conn.commit()
    conn.close()

    return res


@app.route("/sql/1/put", methods=['POST'])
def put():
    data = request.json

    conn = get_conn()
    cur = conn.cursor()

    sql = data['sql']
    params = data['params']
    print(data)
    cur.executemany(sql, params) if len(params) > 0 else cur.execute(sql, params)

    conn.commit()
    cur.close()
    conn.close()

    federate(sql, params)

    return as_response("👍")


"""
Non-HTTP Methods
"""

def as_response(payload):
    resp = Response(json.dumps(payload))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


def federate(sql, params):
    """
    Will proxy the sql and params to all the configured secondary
    servers.

    @type     sql: string
    @param    sql: The sql sent by the client
    @type  params: list
    @param params: The sql bind parameters

    @rtype: boolean
    @return: Boolean indicating success.
    """
    success = True
    status = ""
    if "secondary" in config:
        success = False
        for url in config['secondary']:
            payload = '"sql": "{}", "params": {}'.format(sql, json.dumps(params))
            r = requests.post(url + "/sql/1/put",
                              data = '{' + payload + '}',
                              headers = {'content-type': 'application/json'})
            status = status + str(r.status_code) + "|" + url + "\n"
            success = success and r.status_code == 200

    print(status)
    return success


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
    global config
    config = json.loads(open("config.json", "r").read())
    validate_config(config)


def get_conn():
    return sqlite3.connect('main.db')


def startup():
    get_conn()
    load_config()

startup()
