# Testing


In the `Integrations center` > `Data converters` create new JavaScript converter.

## Uplink

Example `Payload content`: `DAEAWA==`

The `Decoder` function content should be taken from the [bundle file](../../../dist/thingsboard/analog/uplink.min.js) (or its [not minified version](../../../dist/thingsboard/analog/uplink.js)).

Expected `Output`:

```json
{
    "deviceName": "Some Device Name",
    "deviceType": "Water Meter",
    "attributes": {
        "model": "Device Model",
        "serialNumber": "SN111",
        "manufacturer": "Device Manufacturer"
    },
    "messages": {
        "commands": [{
            "id": 12,
            "name": "correctTime2000",
            "headerSize": 2,
            "bytes": [12, 1, 0],
            "config": {
                "hardwareType": 0
            },
            "parameters": {
                "status": 0
            }
        }],
        "bytes": [12, 1, 0, 88],
        "lrc": {
            "expected": 88,
            "actual": 88
        }
    },
    "metadata": {
        "integrationName": "Test integration"
    }
}
```


## Downlink

Example `Message`:

```json
{
    "commands": [
        {
            "id": 12,
            "parameters": {"sequenceNumber": 45, "seconds": -120}
        }
    ]
}
```

The `Encoder` function content should be taken from the [bundle file](../../../dist/thingsboard/analog/downlink.min.js) (or its [not minified version](../../../dist/thingsboard/analog/downlink.js)).

Expected `Output`:

```json
{
    "contentType": "BINARY",
    "data": "DAItiP4="
}
```
