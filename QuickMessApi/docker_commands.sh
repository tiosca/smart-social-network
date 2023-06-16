docker build -t quickmess-api:v1 . 
docker run -p 5123:5123 --name quickmess-backend --net wtl-network --ip 172.19.0.11 quickmess-api:v1