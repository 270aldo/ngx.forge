import jwt
from backend.app.apis.a2a import AgentInfo, A2AMessage

JWT_SECRET = "nexusforge_default_secret"


def make_token():
    return jwt.encode({"sub": "testuser"}, JWT_SECRET, algorithm="HS256")


def auth_headers():
    return {"Authorization": f"Bearer {make_token()}"}


def test_verify_token(client):
    resp = client.get("/routes/auth/verify-token", headers=auth_headers())
    assert resp.status_code == 200
    assert resp.json()["user_id"] == "testuser"


def test_supabase_config(client):
    import databutton
    databutton.secrets.set("SUPABASE_ANON_KEY", "anon")
    resp = client.get("/routes/supabase-config", headers=auth_headers())
    assert resp.status_code == 200
    assert resp.json()["anon_key"] == "anon"


def test_a2a_send(client):
    message = A2AMessage(
        from_agent=AgentInfo(agent_id="a1"),
        to_agent=AgentInfo(agent_id="a2"),
        message_type="text",
        content={"text": "hello"},
    )
    resp = client.post("/routes/a2a/send", json=message.model_dump(), headers=auth_headers())
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "message_id" in data


def test_agents_status(client):
    resp = client.get("/routes/orchestrator/agents/status", headers=auth_headers())
    assert resp.status_code == 200
    data = resp.json()
    assert "agents" in data
    assert isinstance(data["agents"], list)
