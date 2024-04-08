import './polyfills.js';

import * as commands from 'jooby-codec/analog/commands/uplink';

import {testCommands} from '../../utils/tests.js';


logs += testCommands(commands);
