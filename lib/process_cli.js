const fs    = require("fs");
const path  = require("path");
const {EOL} = require('os')

const process_cli = function(argv_vals){
  const dirA      = argv_vals["--source-dir"]
  const dirB      = argv_vals["--target-dir"]
  const landmarks = argv_vals["--landmarks-file"]
  const options   = argv_vals["--options-file"]

  main(dirA, dirB, landmarks, options)
}

module.exports = {merge_text_files: process_cli}

// -----------------------------------------------------------------------------

// insert data from files under dirA => into files under dirB
// using landmarks to know insertion points
// where landmarks = [{src_contains, before_dst_line_contains, after_dst_line_contains}]
// where options = {ignore_src_contains, exit_on_missing_landmark, exit_on_missing_insertion_point}

const main = (dirA, dirB, landmarks, options) => {
  const filepathsA = getFilepathsInDir(dirA).map(filepath => getRelativeFilepath(dirA, filepath))
  const filepathsB = getFilepathsInDir(dirB).map(filepath => getRelativeFilepath(dirB, filepath))
  let fpA, fpB, compare

  while ((fpA || filepathsA.length) && (fpB || filepathsB.length)) {
    fpA = fpA || filepathsA.shift()
    fpB = fpB || filepathsB.shift()

    compare = sortCompare(fpA, fpB)

    if (compare === 0) {
      processFilepath({dirA, dirB, landmarks, fpA, fpB, options})
      fpA = null
      fpB = null
    }
    if (compare === -1) {
      fpA = null
    }
    if (compare === 1) {
      fpB = null
    }
  }
}

// -----------------------------------------------------------------------------

const getFilepathsInDir = (dir) => {
  const filepaths = []

  const callback = ({filepath}) => {
    filepaths.push(filepath)
  }

  walkSync(dir, callback)

  filepaths.sort(sortCompare)

  return filepaths
}

const walkSync = (dir, callback) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    var filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    }
    else if (stats.isFile()) {
      callback({dir, file, filepath, stats});
    }
  })
}

const sortCompare = (a, b) => {
  return (a === b)
    ? 0
    : (a < b)
      ? -1
      : 1
}

// -----------------------------------------------------------------------------

const getRelativeFilepath = (basedir, filepath) => {
  return (filepath.indexOf(basedir) === 0)
    ? filepath.substring(basedir.length, filepath.length)
    : filepath
}

// -----------------------------------------------------------------------------

const processFilepath = ({dirA, dirB, landmarks, fpA, fpB, options={}}) => {
  const filepathA = `${dirA}${fpA}`
  const filepathB = `${dirB}${fpB}`

  const contentA = fs.readFileSync(filepathA, {encoding: 'utf8'}).split(/\r?\n/)
  const contentB = fs.readFileSync(filepathB, {encoding: 'utf8'}).split(/\r?\n/)

  const contentBOriginalLength = contentB.length

  let lineA, landmark, lmi, lm, lineB, lineBindex, lb
  while (contentA.length) {
    lineA = contentA.shift()

    if (options.ignore_src_contains instanceof RegExp) {
      if (options.ignore_src_contains.test(lineA)) {
        continue
      }
    }

    if (typeof options.ignore_src_contains === 'string') {
      if (lineA.indexOf(options.ignore_src_contains) >= 0) {
        continue
      }
    }

    landmark = null
    for (lmi=0; (lmi < landmarks.length) && !landmark; lmi++) {
      lm = landmarks[lmi]  // {src_contains, before_dst_line_contains, after_dst_line_contains}

      if (lm.src_contains instanceof RegExp) {
        if (lm.src_contains.test(lineA)) {
          landmark = lm
          break
        }
      }

      if (typeof lm.src_contains === 'string') {
        if (lineA.indexOf(lm.src_contains) >= 0) {
          landmark = lm
          break
        }
      }
    }

    if (!landmark) {
      console.log(`No landmark to determine insertion placement for line:\n  ${lineA}\nin:\n  ${filepathA}\n`)

      if (options.exit_on_missing_landmark) {
        process.exit(1)
      }
      else {
        continue
      }
    }

    lineB = null
    for (lineBindex = 0; (lineBindex < contentB.length) && !lineB; lineBindex++) {
      lb = contentB[lineBindex]

      if (lm.before_dst_line_contains instanceof RegExp) {
        if (lm.before_dst_line_contains.test(lb)) {
          lineB = lb
          break
        }
      }

      if (typeof lm.before_dst_line_contains === 'string') {
        if (lb.indexOf(lm.before_dst_line_contains) >= 0) {
          lineB = lb
          break
        }
      }

      if (lm.after_dst_line_contains instanceof RegExp) {
        if (lm.after_dst_line_contains.test(lb)) {
          lineB = lb
          lineBindex++
          break
        }
      }

      if (typeof lm.after_dst_line_contains === 'string') {
        if (lb.indexOf(lm.after_dst_line_contains) >= 0) {
          lineB = lb
          lineBindex++
          break
        }
      }
    }

    if (!lineB) {
      console.log(`Landmark:\n  ${JSON.stringify(landmark)}\nto determine insertion placement for line:\n  ${lineA}\nin:\n  ${filepathA}\nnot found in target file:\n  ${filepathB}\n`)

      if (options.exit_on_missing_insertion_point) {
        process.exit(1)
      }
      else {
        continue
      }
    }

    contentB.splice(lineBindex, 0, lineA)
  }

  if (contentBOriginalLength !== contentB.length) {
    fs.writeFileSync(filepathB, contentB.join(EOL), {encoding: 'utf8'})
  }
}
