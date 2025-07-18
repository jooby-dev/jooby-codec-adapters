// these options can be edited
// available hardware types can be found here:
// https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/basics.md#hardware-types
var config = {
    // required field
    hardwareType: 0,
};


// https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/downlink/
function encodeDownlink ( input ) {
    return {
        bytes: toBytes(input.data.commands),
        fPort: 1,
        warnings: [],
        errors: [],
    };
}


//#region [autogenerated jooby-codec bundle from index.js]
/*{{bundle}}*/
//#endregion
