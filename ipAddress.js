const os = require("os");

function getLocalIPAddress() {
	const networkInterfaces = os.networkInterfaces();
	// Iterate over network interfaces to find the one that is not internal (127.0.0.1) and IPv4
	for (const interfaceName in networkInterfaces) {
		const interfaceInfoList = networkInterfaces[interfaceName];
		for (const interfaceInfo of interfaceInfoList) {
			if (!interfaceInfo.internal && interfaceInfo.family === "IPv4") {
				return interfaceInfo.address;
			}
		}
	}
	return null; // Return null if no local IP address is found
}

// Usage
const localIPAddress = getLocalIPAddress();
console.log("Local IP Address:", localIPAddress);

// Export the function directly to use it in other files
module.exports = getLocalIPAddress;
