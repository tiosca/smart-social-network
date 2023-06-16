docker build -t quickmess-app:v1 .
docker run -p 2014:2014 --name quickmess-frontend --net wtl-network --ip 172.19.0.12 quickmess-app:v1
