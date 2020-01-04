#!/usr/bin/env node

import sade from 'sade';

import { addBuildCommand, addWatchCommand } from './build/index';
import { addTestCommand } from './test/index';
import { addLintCommand } from './lint/index';
import { addCreateCommand } from './create/index';

const prog = sade('tsdx');

addBuildCommand(prog);
addWatchCommand(prog);
addTestCommand(prog);
addLintCommand(prog);
addCreateCommand(prog);

prog.parse(process.argv);
