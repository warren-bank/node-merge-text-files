const process_argv = require('@warren-bank/node-process-argv')

const argv_flags = {
  "--help":                                 {bool: true},
  "--version":                              {bool: true},

  "--source-dir":                           {file: "path-exists"},
  "--target-dir":                           {file: "path-exists"},
  "--landmarks-file":                       {file: "module"},
  "--options-file":                         {file: "module"},

  "--android-options":                      {bool: true},
  "--android-append":                       {bool: true}
}

const argv_flag_aliases = {
  "--help":                                 ["-h"],
  "--version":                              ["-v"],
  "--source-dir":                           ["-s"],
  "--target-dir":                           ["-t"],
  "--landmarks-file":                       ["-l"],
  "--options-file":                         ["-o"],
  "--android-options":                      ["-a"],
  "--android-append":                       ["-aa"]
}

let argv_vals = {}

try {
  argv_vals = process_argv(argv_flags, argv_flag_aliases)
}
catch(e) {
  console.log('ERROR: ' + e.message)
  process.exit(1)
}

if (argv_vals["--help"]) {
  const help = require('./help')
  console.log(help)
  process.exit(0)
}

if (argv_vals["--version"]) {
  const data = require('../../package.json')
  console.log(data.version)
  process.exit(0)
}

if (!argv_vals["--source-dir"]){
  console.log("ERROR: Source directory path is required.")
  process.exit(0)
}

if (!argv_vals["--target-dir"]){
  console.log("ERROR: Target directory path is required.")
  process.exit(0)
}

if (argv_vals["--android-options"]){
  argv_vals["--options-file"] = {
    ignore_src_contains:             /(?:^\s*$|^\s*<\?xml|^\s*<[\/]?resources>\s*$)/,
    exit_on_missing_landmark:        false,
    exit_on_missing_insertion_point: false
  }
}

if (argv_vals["--android-append"]){
  argv_vals["--landmarks-file"] = [
    {
      src_contains: 'name="',
      before_dst_line_contains: '</resources>'
    }
  ]
}

if (!argv_vals["--landmarks-file"]){
  console.log("ERROR: Landmarks file path is required.")
  process.exit(0)
}

if (!argv_vals["--options-file"]){
  argv_vals["--options-file"] = {}
}

module.exports = argv_vals
