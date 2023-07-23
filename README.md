# Robsons

![Screenshot from 2023-07-23 09-43-28](https://github.com/saiful64/Robsons-v2/assets/93570937/fc5b066c-8816-47b4-a939-3280c9a4254f)

## Clone the project and follow the steps:

### Start the server:
* `cd server`
* `node server`

### Start the client:
* `cd client`
* `npm run dev`


## Add your IP addresses
* client -> vite.config.js -> host -> < your_ip >
* client -> src -> components -> -> config.js  ->  < your_ip >
* server -> server.js -> const API_BASE_URL = " <  your ip  >"
* 


## Add this to your database
* CREATE USER 'root'@'10.10.56.xxx' IDENTIFIED BY '';
* GRANT ALL PRIVILEGES ON robsonclassification.* TO 'root'@'10.10.56.xxx';
