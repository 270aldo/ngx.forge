#!/bin/bash

uv venv -p 3.11
source ./venv/bin/activate
uv pip install -r requirements.txt
