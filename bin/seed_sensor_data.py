import json
import os
import random
import requests
import sqlite3
from datetime import datetime, timedelta

conn = sqlite3.connect('main.db')
cur = conn.cursor()

sensor_types = ['weather', 'temperature', 'air_pressure']
sensor_states = ['set', 'get', 'state2', 'staten']

def generate_random_utc_time():
  """Generates a random UTC time between now and one month ago as an epoch."""

  # Get the current UTC time.
  now = datetime.utcnow()

  # Get the UTC time one month ago.
  one_month_ago = now - timedelta(days=30)

  # Generate a random number between 0 and the number of seconds between now and one month ago.
  random_number = random.randint(0, (now - one_month_ago).total_seconds())

  # Convert the random number to an epoch.
  epoch = one_month_ago.timestamp() + random_number

  return epoch

for i in range(0, 1000, 1):
    type = random.choice(sensor_types)
    state = random.choice(sensor_states)
    value = random.uniform(0.00, 500.00)
    time = int(generate_random_utc_time()) 
    metadata = '{}'

    sql = 'insert into sensor_data values(?, ?, ?, ?, ?)'
    params = [[time, type, state, value, metadata]]
    payload = '"sql": "{}", "params": {}'.format(sql, json.dumps(params))
    host = os.getenv('HOST')
    port = os.getenv('PORT')

    r = requests.post("http://{}:{}/sql/1/put".format(host, port),
                        data='{' + payload + '}',
                        headers={'content-type': 'application/json'})

    if r.status_code != 200:
       print("failed :(")