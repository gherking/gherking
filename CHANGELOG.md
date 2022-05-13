# Changelog

## Unreleased

### Changed

- Updated schema to draft-07

## 2.1.1

### Added

- Added JSON Schema for the configuration file
- Added description about the precompilers

## 2.1.0

### Added

- Added support for default export of precompiler object or class
- Upgraded dependencies to support comments
- Added `onDocument`

## 2.0.0

The first fully working version, after the TypeScript and API refactor.

## (gherkin-precompiler) 1.3.1 - 2018-12-17

### Fixed

- Fixed bin EOL issue

## (gherkin-precompiler) 1.3.0 - 2018-04-19

### Added

- Added predefined precompiler: scenarioOutlineExpander ([#29]
(https://github.com/judit-nahaj/gherkin-precompiler/issues/29))

### Changeed

- Upgraded for gherkin-assembler @2 and gherkin-ast

## (gherkin-precompiler) 1.2.1 - 2018-02-14

### Fixed

- Fixed macro precompiler issue on backgrounds ([#27](http://github.com/judit-nahaj/gherkin-precompiler/issues/27))

## (gherkin-precompiler) 1.2.0 - 2018-01-31

### Added

- Added predefined precompiler: removeDuplicates ([#10](https://github.com/judit-nahaj/gherkin-precompiler/issues/10))
- Added predefined precompiler: scenarioNumbering ([#6](https://github.com/judit-nahaj/gherkin-precompiler/issues/6))
- Added predefined precompiler: stepGroups ([#7](https://github.com/judit-nahaj/gherkin-precompiler/issues/7))
- Added method to create macro step ([#18](https://github.com/judit-nahaj/gherkin-precompiler/issues/18))

### Fixed

- CLI commands are not working ([#19](http://github.com/judit-nahaj/gherkin-precompiler/issues/19))

## (gherkin-precompiler) 1.1.0 - 2017-12-04

### Added

- Added Gulp plugin ([#3](https://github.com/judit-nahaj/gherkin-precompiler/issues/3))
- Added predefined precompiler: scenarioOutlineNumbering ([#5](https://github.com/judit-nahaj/gherkin-precompiler/issues/5))
- Added predefined precompiler: macro ([#9](https://github.com/judit-nahaj/gherkin-precompiler/issues/9))
- Added predefined precompiler: forLoop ([#8](https://github.com/judit-nahaj/gherkin-precompiler/issues/8))

## (gherkin-precompiler) 1.0.0 - 2017-09-25

### Added

- Add code to apply preprocessing rules to Gherkin feature files ([#1](https://github.com/judit-nahaj/gherkin-precompiler/issues/1))
- Add predefined precompilers: replacer ([#2](https://github.com/judit-nahaj/gherkin-precompiler/issues/2))