# Info

[The Things Network](https://www.thethingsnetwork.org/) - one of the supported NS in the adapters.


## Setting Up Payload Formatters

1. Select your [region](https://console.cloud.thethings.network/) in console.
1. Choose "Applications" and then go to the application by clicking on its name in the list of applications.
1. In the left menu, select "Payload Formatters".
1. Select "Uplink" to configure formatters for uplink messages (messages from devices to the network).
1. Choose "Custom JavaScript formatter".
1. Insert content from the [uplink.min.js](../../dist/ttn/analog/uplink.min.js).
1. Click "Save changes". Repeat for Downlink with [downlink.min.js](../../dist/ttn/analog/downlink.min.js).


## Testing Payload Formatters

1. Go to the application.
1. In the left menu, select "End devices." You must have at least one device to test adapters.
1. Select the device and then choose "Payload formatters" from the top tabs. Here you can test input and output data.
1. If everything is set up correctly, you will see the decoded data in the "decoded test payload" section.
