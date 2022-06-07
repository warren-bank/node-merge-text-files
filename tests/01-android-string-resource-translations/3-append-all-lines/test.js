const path = require("path");

const dirA = path.join(__dirname, '..', '0-shared-data', '1-new-strings', 'res')
const dirB = path.join(__dirname, 'merged-strings', 'res')

const landmarks = require('./landmarks-append-all-lines')

const options = {
  ignore_src_contains:             /(?:^\s*$|^\s*<\?xml|^\s*<[\/]?resources>\s*$)/,
  exit_on_missing_landmark:        false,
  exit_on_missing_insertion_point: false
}

const {merge_text_files} = require('../../../lib/process_cli')

const argv_vals = {
  "--source-dir":     dirA,
  "--target-dir":     dirB,
  "--landmarks-file": landmarks,
  "--options-file":   options
}

merge_text_files(argv_vals)
