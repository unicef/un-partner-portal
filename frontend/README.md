This is frontend part of unpp app

Application can be run locally using 
```yarn run start```
This runs app on localhost:8080

but to build fully with BE, do: 
```docker-compose build```
After long wait:
```fab up```
And observe app on localhost:8080

However dev server seems to disconnect often inside docker, then it needs `fab down` and `fab up` again
One workaround is to run `fab up` but then `yarn run start` separately, app will notice port is already used so say 'yes' and pick another, then app will run on localhost:8081. That way you got good dev server with BE running on 8080 so all calls should go through

After starting app requires user role to be defined, go to local storage and add role: 'partner' or 'agency'
in order to see actual content, switch between them when necessary
