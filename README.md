# BZ Backend
Store hero list belongs to each owner
Store market orders
## Development
### Install
```
yarn
```
### Run
```
yarn start:{service_name}
```
## Production
### (Option 1) - Use pm2
Run for server s1
```
pm2 start s1-ecosystem.config.js --env productions1
```
Run for server s2
```
pm2 start s2-ecosystem.config.js --env productions2
```

### (Option 2) - Use Docker
*** Environment Variables:
- DB_PREFIX: _mongodb_ or _mongodb+srv_
- DB_HOST: database host name
- DB_PORT: database port number
- DB_USER: database username
- DB_PASSWORD: database password
- DB_NAME: database name
- NODE_ENV: _production-s1_ or _production-s2_

The project contains 5 services:
1. API server (for DApp Marketplace):

   Build image
    ```bash
      docker build -f Dockerfile.Api . -t pe-api
    ```
   Run container
   
   Environment variables: DB_PREFIX, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV
   ```bash
   # Run for server s1
   docker run --env NODE_ENV=production-s1 --env DB_PREFIX=mongodb+srv --env DB_HOST=cluster0.fbmnkmc.mongodb.net --env DB_PORT=27017 --env DB_USER=user --env DB_PASSWORD=password --env DB_NAME=pes1 -p 4003:4003 pe-api
   ```
2. API for sync (for syncing level from Game server):
 
   Build image
    ```bash
      docker build -f Dockerfile.Sync . -t pe-sync
    ```
   Run container
 
   Environment variables: DB_PREFIX, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV
   ```bash
   # Run for server s1
   docker run --env NODE_ENV=production-s1 --env DB_PREFIX=mongodb+srv --env DB_HOST=cluster0.fbmnkmc.mongodb.net --env DB_PORT=27017 --env DB_USER=user --env DB_PASSWORD=password --env DB_NAME=pes1 -p 5003:5003 pe-sync
   ```
3. Update statistics (calculate statistics information on Marketplace - Ex: total volume, total sale):
 
   Build image
    ```bash
      docker build -f Dockerfile.Statistics . -t pe-statistics
    ```
   Run container
 
   Environment variables: DB_PREFIX, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV
   ```bash
   # Run for server s1
   docker run --env NODE_ENV=production-s1 --env DB_PREFIX=mongodb+srv --env DB_HOST=cluster0.fbmnkmc.mongodb.net --env DB_PORT=27017 --env DB_USER=user --env DB_PASSWORD=password --env DB_NAME=pes1 pe-statistics
   # Run for server s2
   docker run --env NODE_ENV=production-s2 --env DB_PREFIX=mongodb+srv --env DB_HOST=cluster0.fbmnkmc.mongodb.net --env DB_PORT=27017 --env DB_USER=user --env DB_PASSWORD=password --env DB_NAME=pes2 pe-statistics
   ```
4. Subscribe events (listen on smart contract event from blockchain):
 
   Build image
    ```bash
      docker build -f Dockerfile.Event . -t pe-event
    ```
   Run container
 
   Environment variables: DB_PREFIX, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV
   ```bash
   # Run for server s1
   docker run --env NODE_ENV=production-s1 --env DB_PREFIX=mongodb+srv --env DB_HOST=cluster0.fbmnkmc.mongodb.net --env DB_PORT=27017 --env DB_USER=user --env DB_PASSWORD=password --env DB_NAME=pes1 pe-event
   ```
5. Deposit events (listen on Deposit smart contract event from blockchain):
 
   Build image
    ```bash
      docker build -f Dockerfile.DepositEvent . -t pe-deposit-event
    ```
   Run container
 
   Environment variables: DB_PREFIX, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV
   ```bash
   # Run for server s1
   docker run --env NODE_ENV=production-s1 --env DB_PREFIX=mongodb+srv --env DB_HOST=cluster0.fbmnkmc.mongodb.net --env DB_PORT=27017 --env DB_USER=user --env DB_PASSWORD=password --env DB_NAME=pes1 pe-deposit-event
   ```

### Fix Block Delay
1. Change RPC for environment: **config/main** (for *production*) and **config/openbeta** (for *openbeta*)
2. Run:
```bash
pm2 restart all
```
