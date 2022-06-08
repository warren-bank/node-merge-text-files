### [merge-text-files](https://github.com/warren-bank/node-merge-text-files)

Insert lines of text from files in a source directory into corresponding files in a target directory using landmarks within the target text files to determine the insertion points.

#### Installation:

```bash
npm install --global @warren-bank/merge-text-files
```

#### Usage:

```bash
mtf <options>

==================
options (general):
==================

"-h"
"--help"
    Print a help message detailing all command-line options.

"-v"
"--version"
    Display the version.

"-s" <dirpath>
"--source-dir" <dirpath>
    Path to source directory,
    which contains the text files that will be inserted line-by-line
    into a target directory.

"-t" <dirpath>
"--target-dir" <dirpath>
    Path to target directory,
    which contains a file tree that includes all filepaths
    that are found within the source directory.
    Each file in the source directory will be merged
    into its corresponding file in the target directory.
    Merger occurs by injecting each line of source
    at a position within target that is defined by a landmark.

"-l" <filepath>
"--landmarks-file" <filepath>
    Path to the landmarks file,
    which defines a mapping from each particular line in a source file
    to a particular position within its corresponding target file.
    The content of this file is a CommonJS module,
    which exports an Array of Objects.
    Each object has the attributes:
      * "src_contains"
      * "before_dst_line_contains"
      * "after_dst_line_contains"
    The purpose for each attribute is:
      * "src_contains" uniquely identifies a line in the source file
      * either "before_dst_line_contains" or "after_dst_line_contains"
        uniquely identifies a line in the target file
      * the line identified by "src_contains" will be inserted
        into the target file such that it occurs either:
        - before the line identified by "before_dst_line_contains"
        - after the line identified by "after_dst_line_contains"
    The value of any attribute can be either a String or RegExp.
      * if a String:
        - the value is a substring that should only occur within one line
      * if a RegExp:
        - the value should only match one line

"-o" <filepath>
"--options-file" <filepath>
    Path to the options file,
    which configures certain behavior of the application.
    The content of this file is a CommonJS module,
    which exports an Object having the attributes:
      * "ignore_src_contains"
      * "exit_on_missing_landmark"
      * "exit_on_missing_insertion_point"
    The purpose for each attribute is:
      * "ignore_src_contains" allows matching lines in source files to be ignored.
      * "exit_on_missing_landmark" allows execution of the app to terminate
        when a non-ignored line in a source file
        does not match the "src_contains" pattern of any Object in the landmarks file.
        In any case, the condition is logged to stdout.
      * "exit_on_missing_insertion_point" allows execution of the app to terminate
        when a file in the destination directory does not contain any line of text
        that matches either the "before_dst_line_contains" or "after_dst_line_contains"
        patterns of the Object in the landmarks file,
        which is being processed after having matched a line in the source file.
        In any case, the condition is logged to stdout.
    The datatype of each attribute is:
      * "ignore_src_contains" can be either a String or RegExp.
      * "exit_on_missing_landmark" and "exit_on_missing_insertion_point"
        are both boolean and default to false.

"-a"
"--android-options"
    Boolean flag to use a set of pre-configured options,
    which are well-suited for a particular common use-case:
      * the processing of Android string resource directories
    The value of these options are:
      {
        ignore_src_contains:             /(?:^\s*$|^\s*<\?xml|^\s*<[\/]?resources>\s*$)/,
        exit_on_missing_landmark:        false,
        exit_on_missing_insertion_point: false
      }

"-aa"
"--android-append"
    Boolean flag to use a set of pre-configured landmarks,
    which are only applicable for a particular common use-case:
      * the processing of Android string resource directories
    and defines a generic mapping whereby all string resources in the source files
    will append to the end of the corresponding destination file.
    The value of the landmarks mapping is:
      [
        {
          src_contains:             'name="',
          before_dst_line_contains: '</resources>'
        }
      ]
```

#### Caveats:

* Android string resources
  - any Android string resource definition that spans multiple lines is not supported,<br>since this utility individually processes each line of source files

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
