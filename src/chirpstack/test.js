
// output: {data: {temp: 22.5}}
console.log('decodeUplink', JSON.stringify(
    decodeUplink({
        bytes: [0x0c, 0x01, 0x00, 0x58],
        fPort: 0,
        variables: {}
    })
));

// output: {bytes: [4, 55, 0]}
console.log('encodeDownlink', JSON.stringify(
    encodeDownlink({
        data: [{id: 12, parameters: {sequenceNumber: 45, seconds: -120}}],
        variables: {}
    })
));
