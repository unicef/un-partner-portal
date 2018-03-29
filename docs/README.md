# un-partner-portal

## Setup

1. Install Docker for your OS
2. Create .env file in `backend` with the reference of `.env.example` or receive .env file from your team member.
3. Run `fab up` !
4. Go to [http://127.0.0.1:8080/](http://127.0.0.1:8080/) to see the frontend / REACT JS running. The Django app is running under [http://127.0.0.1:8080/api/](http://127.0.0.1:8080/api/)
5. Run `fab reset_db` - load fake data like account, core, partner and other modules!

## Development

Here are some docker tips:  
   1. display all containers:

```text
   $ fab ps
```

1. ssh into running backend container

   ```text
   $ fab ssh:backend
   ```

2. Stop all containers

   ```text
   $ fab stop
   ```

3. Re-build docker images for containers

   ```text
   $ fab rebuild
   ```

