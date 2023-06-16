#run mongo db
docker run --name wtl-mongo -d --network wtl-network --ip=172.19.0.10 -p 27018:27017 mongo
