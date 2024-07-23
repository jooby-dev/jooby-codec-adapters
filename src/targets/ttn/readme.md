# Info

[The Things Network](https://www.thethingsnetwork.org/) - one of the supported NS in the adapters.

## Setting Up Payload Formatters

Select your [region](https://console.cloud.thethings.network/) in console.
Choose "Applications" and then go to the application by clicking on its name in the list of applications.
In the left menu, select "Payload Formatters".
Select "Uplink" to configure formatters for uplink messages (messages from devices to the network).
Choose "Custom JavaScript formatter".
Insert content from the [uplink.min.js](../../dist/ttn/analog/uplink.min.js).
Click "Save changes". Repeat for Downlink with [downlink.min.js](../../dist/ttn/analog/downlink.min.js).

## Testing Payload Formatters

Go to the application.
In the left menu, select "End devices." You must have at least one device to test adapters.
Select the device and then choose "Payload formatters" from the top tabs. Here you can test input and output data.
If everything is set up correctly, you will see the decoded data in the "decoded test payload" section.
