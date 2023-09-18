# Robsons

![Screenshot from 2023-09-15 20-15-10](https://github.com/saiful64/Robsons-v2/assets/93570937/bb48c67e-6d40-4db8-b492-711854806cc7)


## Clone the project and follow the steps:

### Start the server:
* `cd server`
* `node server`

### Start the client:
* `cd client`
* `npm run dev`


## Add your IP addresses
* client -> src -> components -> -> config.js  ->  < your_ip >:<server_port>


## Add this to your database
* CREATE USER 'root'@'10.10.56.xxx' IDENTIFIED BY '';
* GRANT ALL PRIVILEGES ON robsonclassification.* TO 'root'@'10.10.56.xxx';
