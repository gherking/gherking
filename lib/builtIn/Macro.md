# Macro for Gherkin precompiler

This Macro is responsible for defining macros in feature files and then
using them

To use it a @macro(${macroName}) tag must be added to a scenario. This
scenario will not run on its own, it is only for defining the macro.
In another scenario when a step "macro ${macroName} is executed" is used
the steps of the macro with the same name will be executed.

Restrictions: Macro definition scenario cannot contain a macro executing
step.

See examples for the input files and an output in the test/data folder.