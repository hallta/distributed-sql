# Distributed SQL

A way to configure a redundant SQLLite database across different nodes.
Intended to federate across an array of Raspberry Pi devices, but should
work across any hardware.

I just made this for fun. There's probably plenty of other well vetted
solutions out there that do roughly the same thing. I didn't look. 

# Setup

1. `python3 -m venv env`
1. `source env/bin/activate`
1. `pip install -r requirements.txt`
1. `sudo $(which flask) --app main run --port 80`
