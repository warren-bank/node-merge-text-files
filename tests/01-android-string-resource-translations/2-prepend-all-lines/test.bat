@echo off

set dir_unmodified_old_strings="%~dp0.\..\0-shared-data\2-old-strings"
set dir_merged_strings="%~dp0.\merged-strings"

rem :: make a copy of the shared directory "2-old-strings" and name it "merged-strings"
if exist %dir_merged_strings% rmdir /S /Q %dir_merged_strings%
xcopy %dir_unmodified_old_strings% %dir_merged_strings% /E /I /Q

rem :: run test by inserting lines of text from "1-new-strings" into corresponding files in "3-merged-strings" at explicitly defined landmarks
rem :: save all output to "test.log"
node "%~dpn0.js" > "%~dpn0.log" 2>&1
