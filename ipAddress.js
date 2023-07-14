import os from "os";

function getIPAddress() {
	const networkInterfaces = os.networkInterfaces();
	const wifiInterface =
		networkInterfaces["Wi-Fi"] || networkInterfaces["wlan0"]; // Replace with your specific interface name

	if (wifiInterface) {
		const wifiAddressInfo = wifiInterface.find(
			(address) => address.family === "IPv4" && !address.internal
		);

		if (wifiAddressInfo) {
			return wifiAddressInfo.address;
		}
	}

	return "localhost"; // Fallback to localhost if the WiFi IP address is not found
}

export default getIPAddress;
