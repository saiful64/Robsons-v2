# Robsons

## Clone the project and follow the steps:

### Start the server:
* `cd server`
* `node server`

### Start the client:
* `cd client`
* `npm run dev`


## Add your IP addresses
* client -> vite.config.js -> host -> < your_ip >
* client -> src -> components -> < your_ip >
* server -> server.js -> const API_BASE_URL = " <  your ip  >"
* 


## Add this to your database
* CREATE USER 'root'@'10.10.56.xxx' IDENTIFIED BY '';
* GRANT ALL PRIVILEGES ON robsonclassification.* TO 'root'@'10.10.56.xxx';
