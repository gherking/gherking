# ForLoop for Gherkin precompiler

This precompiler is responsible for repeating selected scenarios or scenario outlines.
In case of scenario outlines it copies all rows of examples, resulting iterator*rows number of scenarios when tests are run.





Usage:{
1. Identify scenario or scenario outline to be repeated with ${loopTag}(${i}). The default value for the tag is @loop(${i}), and the default limit for ${i} is 10.

The procompiler will then copy this scenario or scenario outline for ${i} times, modifying it name to '&{originaName} ($@{i})' by default, and removes the loop tag.

Configurable variables and their default options:
1. maxValue: 10,
2. tagName: 'loop',
3. format: '${name} (${i})'

See examples for the input files and an output in the test/data folder.