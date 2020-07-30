#! /usr/bin/env node

import main from './main';
import * as process from 'process';

const args = process.argv.slice(2);

main(args);
