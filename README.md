# dVault

dVault is an alpha version system that aims to implement a decentralized password manager like 1Password or lastpass over Tor.

dVault use a distributed hash table DHT to save your encrypted data on the network nodes and it uses Tor network for encrypt comunication among nodes.

## Getting Started

You have two ways to install dVault on your desktop.

### **NodeJs**
* Install Nodejs v10
  
* Clone this repo: <br/>
`git clone https://github.com/andmagom/dVault.git`

* Install dependencies: <br/>
`npm install`

* Execute dVault: <br/>
  `npm start`

### **Docker**
* Install docker platform
  
* Pull Docker image: <br/>
  `docker pull andmagom/dvault`

* Run the dVault container:   <br/>
  `docker run  -p 8686:8686 -v dvault-data:/usr/src/app/data andmagom/dvault`


## Configuration

dVault let you modify some parameters for change the default behaivor, just provide the environment variable that you want to modify:

### Environment variables

* **APP_PORT**: Network port of dvault server. **default:** 8686
* **SECRET_SPLIT_SIZE_BYTES**: Bytes to split data. **default:** 50
* **NUMBER_REPLICATIONS**: Number of data replications between nodes further the Kademlia replication. **default:** 4
* **COOKIE_SECRET**: Secret for encrypting data at the browser. **default:** dVault
* **TOR_FOLDER**: Path of Tor configuration. **default:** /usr/src/app/data/hidden_service
* **KADENCE_REFRESH**: Time to refresh kademlia nodes in milliseconds.  **default:** 300000
