import sys
import types
import os
import pytest

# Ensure project root is in path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, ROOT_DIR)
sys.path.insert(0, os.path.join(ROOT_DIR, 'backend'))

# Stub for databutton package
class Secrets:
    def __init__(self):
        self._data = {}
    def get(self, key, default=None):
        return self._data.get(key, default)
    def set(self, key, value):
        self._data[key] = value

class JsonStore(dict):
    def get(self, key, default=None):
        if key not in self:
            raise FileNotFoundError
        return super().get(key, default)
    def put(self, key, value):
        self[key] = value

class Storage:
    def __init__(self):
        self.json = JsonStore()

_db = types.SimpleNamespace(secrets=Secrets(), storage=Storage())
sys.modules.setdefault('databutton', _db)

from backend.main import create_app
from databutton_app.mw.auth_mw import get_authorized_user

@pytest.fixture
def app():
    cwd = os.getcwd()
    os.chdir(os.path.join(ROOT_DIR, 'backend'))
    application = create_app()
    os.chdir(cwd)
    application.dependency_overrides[get_authorized_user] = lambda: {'sub': 'testuser'}
    return application

@pytest.fixture
def client(app):
    from fastapi.testclient import TestClient
    return TestClient(app)
