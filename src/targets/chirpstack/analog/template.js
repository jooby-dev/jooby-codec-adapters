// these options can be edited
// available hardware types can be found here:
// https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/basics.md#hardware-types
var config = {
    hardwareType: 0
};


//#region [autogenerated jooby-codec bundle]
/*{{bundle}}*/
//#endregion


/*
  Get message form bytes.

  Input is an object with the following fields:
    * bytes - byte array containing the uplink payload, e.g. [255, 230, 255, 0]
    * fPort - uplink fPort
    * variables - object containing the configured device variables

  Output must be an object with the following fields:
    * data - object representing the decoded payload
*/
function decodeUplink ( input ) {
    return fromBytes(input.bytes, config);
};


/*
  Get payload bytes from commands.

  Input is an object with the following fields:
    * data - object representing the payload that must be encoded
    * variables - object containing the configured device variables

  Output must be an object with the following fields:
    * bytes - byte array containing the downlink payload
*/
function encodeDownlink ( input ) {
    return {
        bytes: toBytes(input.data, config)
    };
};