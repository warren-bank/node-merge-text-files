#! /usr/bin/env node

const argv_vals          = require('./mtf/process_argv')
const {merge_text_files} = require('../lib/process_cli')

merge_text_files(argv_vals)
