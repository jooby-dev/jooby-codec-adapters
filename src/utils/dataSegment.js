/**
 * Data segment wrapper around an MTX message.
 */

import calculateLrc from 'jooby-codec/utils/calculateLrc.js';


// 0b10010001 (segmentIndex: 1, segmentsNumber: 1, isLast: true)
const SINGLE_SEGMENT_FLAG = 0x91;

const DATA_SEGMENT_COMMAND_ID = 0x1e;


export const get = ( bytes ) => {
    // check if it is a DataSegment command
    if ( bytes[0] !== DATA_SEGMENT_COMMAND_ID ) {
        return {};
    }

    // DataSegment command size
    const size = bytes[1];

    // segment metadata
    const flag = bytes[3];

    // payload
    const data = bytes.slice(4, size + 2);

    // if the mtx message is unencrypted, the device sets the LRC to 0
    // no need to validate for now
    // const expectedLrc = calculateLrc(bytes.slice(0, size + 2));
    // const actualLrc = bytes[size + 2];

    // just a single data segment (without lrc validation)
    if ( flag === SINGLE_SEGMENT_FLAG ) {
        return data;
    }

    return null;
};

export const set = ( bytes ) => {
    const body = [
        DATA_SEGMENT_COMMAND_ID,
        bytes.length + 2,
        0,
        SINGLE_SEGMENT_FLAG,
        ...bytes
    ];

    return [...body, calculateLrc(body)];
};
