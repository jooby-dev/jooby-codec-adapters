import './polyfills.js';

import * as commands from 'jooby-codec/mtx1/commands/downlink';

import {testCommands} from '../../utils/tests.js';


logs += testCommands(commands);
