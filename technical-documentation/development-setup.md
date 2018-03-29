---
description: Tools used and setup instructions
---

# Development Setup

## Local Setup

1. Install [Docker](https://docs.docker.com/engine/installation/) for your OS. Also install Fabric via `pip install fabric`
2. Create .env file with the reference of`.env.example`or receive .env file from your team member.
3. Run`fab up`
4. Go to [http://127.0.0.1:8080/](http://127.0.0.1:8080/) to see the React frontend running. The Django app is running under

   [http://127.0.0.1:8080/api/](http://127.0.0.1:8080/api/)

5. Run `fab fakedata`
   * create mock data like account, partner agencies, etc.
6. Go to [http://127.0.0.1:8080/login](http://127.0.0.1:8080/login) login with fake-user-72@unicef.org/Passw0rd! and can now go t

## Fabric commands

For convenience some [fabric](http://www.fabfile.org/) commands are included, such as getting into Django app container

```text
fab ssh:backend
```

or running tests

```text
fab tests
```

For the mose up-to-date reference just check `fabfile.py` in the repository root.

