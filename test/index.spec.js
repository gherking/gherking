'use strict';

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const API = require(path.resolve('lib/index.js'));
const assembler = require('gherkin-assembler');

const expect = require('chai').expect;

describe('API', () => {
    let ast;
    const SOURCE_FILE = path.resolve('test/data/base.feature');

    before(() => {
        ast = API.load(SOURCE_FILE);
    });

    describe('.load()', () => {
        it('should load a GherkinDocument', () => {
            expect(ast).to.be.instanceOf(assembler.AST.GherkinDocument);
        });
    });

    describe('.save()', () => {
        const TMP_FILE = path.resolve('test/data/save.feature');

        before(() => fs.removeSync(TMP_FILE));
        after(() => fs.removeSync(TMP_FILE));

        it('should save to feature file', () => {
            API.save(TMP_FILE, ast, {
                lineBreak: os.platform() === 'win32' ? '\r\n' : '\n'
            });

            expect(fs.pathExistsSync(TMP_FILE)).to.be.true;
            expect(fs.readFileSync(TMP_FILE, 'utf8')).to.equal(fs.readFileSync(SOURCE_FILE, 'utf8'));
        });
    });

    describe('.process()', () => {
        it('should not do anything if no pre-processor provided', () => {
            expect(API.process(ast)).to.equal(ast);
        });

        it('should copy and not modify AST if base PreProcessor provided', () => {
            const processed = API.process(ast, new API.DefaultConfig());
            expect(processed).to.not.equal(ast);
            expect(processed).to.eql(ast);
        });
    });

    describe('PreProcessor', () => {
        describe('processing events', () => {
            it('should support Feature processing', () => {
                class FeatureProcessor extends API.DefaultConfig {
                    onFeature(feature) {
                        feature.name = 'test';
                        feature.description = 'test';
                    }
                }

                const processed = API.process(ast, new FeatureProcessor());
                expect(processed).to.not.eql(ast);
                expect(processed.feature.name).to.equal('test');
                expect(processed.feature.description).to.equal('test');
            });

            it('should support Background processing', () => {
                class BackgroundProcessor extends API.DefaultConfig {
                    onBackground(background, feature) {
                        feature.name = 'test';
                        feature.description = 'test';
                        background.name = 'test';
                        background.description = 'test';
                    }
                }

                const processed = API.process(ast, new BackgroundProcessor());
                expect(processed).to.not.eql(ast);
                expect(processed.feature.name).to.equal('test');
                expect(processed.feature.description).to.equal('test');
                expect(processed.feature.elements[0].name).to.equal('test');
                expect(processed.feature.elements[0].description).to.equal('test');
            });

            it('should support Scenario processing', () => {
                class ScenarioProcessor extends API.DefaultConfig {
                    onScenario(scenario, feature) {
                        feature.name = 'test';
                        feature.description = 'test';
                        scenario.name = 'test';
                        scenario.description = 'test';
                    }
                }

                const processed = API.process(ast, new ScenarioProcessor());
                expect(processed).to.not.eql(ast);
                expect(processed.feature.name).to.equal('test');
                expect(processed.feature.description).to.equal('test');
                expect(processed.feature.elements[1].name).to.equal('test');
                expect(processed.feature.elements[1].description).to.equal('test');
            });

            it('should support ScenarioOutline processing', () => {
                class ScenarioOutlineProcessor extends API.DefaultConfig {
                    onScenarioOutline(scenario, feature) {
                        feature.name = 'test';
                        feature.description = 'test';
                        scenario.name = 'test';
                        scenario.description = 'test';
                    }
                }

                const processed = API.process(ast, new ScenarioOutlineProcessor());
                expect(processed).to.not.eql(ast);
                expect(processed.feature.name).to.equal('test');
                expect(processed.feature.description).to.equal('test');
                expect(processed.feature.elements[2].name).to.equal('test');
                expect(processed.feature.elements[2].description).to.equal('test');
            });

            it('should support Step processing', () => {
                class StepProcessor extends API.DefaultConfig {
                    onStep(step, parent) {
                        parent.name = 'test';
                        parent.description = 'test';
                        step.text = 'test';
                    }
                }

                const processed = API.process(ast, new StepProcessor());
                expect(processed).to.not.eql(ast);
                processed.feature.elements.forEach(element => {
                    expect(element.name).to.equal('test');
                    expect(element.description).to.equal('test');
                    element.steps.forEach(step => {
                        expect(step.text).to.equal('test');
                    });
                });
            });

            it('should support Tag processing', () => {
                class TagProcessor extends API.DefaultConfig {
                    onTag(tag, parent) {
                        parent.name = 'test';
                        parent.description = 'test';
                        tag.name = 'test';
                    }
                }

                const processed = API.process(ast, new TagProcessor());
                expect(processed).to.not.eql(ast);
                expect(processed.feature.elements[0].name).to.not.equal('test');
                expect(processed.feature.elements[0].description).to.not.equal('test');
                processed.feature.elements.slice(1).forEach(element => {
                    expect(element.name).to.equal('test');
                    expect(element.description).to.equal('test');
                    element.tags.forEach(tag => {
                        expect(tag.name).to.equal('test');
                    });
                });
                processed.feature.elements[2].examples.forEach(examples => {
                    expect(examples.name).to.equal('test');
                    examples.tags.forEach(tag => {
                        expect(tag.name).to.equal('test');
                    });
                });
            });

            it('should support Examples processing', () => {
                class ExamplesProcessor extends API.DefaultConfig {
                    onExamples(examples, outline) {
                        outline.name = 'test';
                        outline.description = 'test';
                        examples.name = 'test';
                    }
                }

                const processed = API.process(ast, new ExamplesProcessor());
                expect(processed).to.not.eql(ast);
                expect(processed.feature.elements[2].name).to.equal('test');
                expect(processed.feature.elements[2].description).to.equal('test');
                processed.feature.elements[2].examples.forEach(examples => {
                    expect(examples.name).to.equal('test');
                });
            });

            it('should support Examples header processing', () => {
                class ExamplesProcessor extends API.DefaultConfig {
                    onExampleHeader(row, examples) {
                        examples.name = 'test';
                        row.cells.push(row.cells[0].clone());
                    }
                }

                const processed = API.process(ast, new ExamplesProcessor());
                expect(processed).to.not.eql(ast);
                processed.feature.elements[2].examples.forEach(examples => {
                    expect(examples.name).to.equal('test');
                    expect(examples.header.cells.length).to.equal(2);
                });
            });

            it('should support Examples row processing', () => {
                class ExamplesProcessor extends API.DefaultConfig {
                    onExampleRow(row, examples) {
                        examples.name = 'test';
                        row.cells.push(row.cells[0].clone());
                    }
                }

                const processed = API.process(ast, new ExamplesProcessor());
                expect(processed).to.not.eql(ast);
                processed.feature.elements[2].examples.forEach(examples => {
                    expect(examples.name).to.equal('test');
                    examples.body.forEach(row => {
                        expect(row.cells.length).to.equal(2);
                    });
                });
            });

            it('should support DocString processing', () => {
                class DocStringProcessor extends API.DefaultConfig {
                    onDocString(docString, step) {
                        step.text = 'test';
                        docString.content = 'test';
                    }
                }

                const processed = API.process(ast, new DocStringProcessor());
                expect(processed).to.not.eql(ast);
                const step = processed.feature.elements[1].steps[4];
                expect(step.text).to.equal('test');
                expect(step.argument.content).to.equal('test');
            });

            it('should support DataTable processing', () => {
                class DataTableProcessor extends API.DefaultConfig {
                    onDataTable(dataTable, step) {
                        step.text = 'test';
                        dataTable.rows.push(dataTable.rows[0].clone());
                    }
                }

                const processed = API.process(ast, new DataTableProcessor());
                expect(processed).to.not.eql(ast);
                const step = processed.feature.elements[1].steps[3];
                expect(step.text).to.equal('test');
                expect(step.argument.rows.length).to.equal(4);
            });

            it('should support replacing simple values', () => {
                class DocStringProcessor extends API.DefaultConfig {
                    onDocString(docString) {
                        const newDocString = docString.clone();
                        newDocString.content = 'test';
                        return newDocString;
                    }
                }

                const processed = API.process(ast, new DocStringProcessor());
                expect(processed).to.not.eql(ast);
                const step = processed.feature.elements[1].steps[4];
                expect(step.argument.content).to.equal('test');
            });

            it('should support replacing list values', () => {
                class ScenarioProcessor extends API.DefaultConfig {
                    onScenario(scenario) {
                        const newScenario = scenario.clone();
                        newScenario.name = 'test';
                        newScenario.description = 'test';
                        return newScenario;
                    }
                }

                const processed = API.process(ast, new ScenarioProcessor());
                expect(processed).to.not.eql(ast);
                expect(processed.feature.elements[1].name).to.equal('test');
                expect(processed.feature.elements[1].description).to.equal('test');
            });

            it('should support deleting list values', () => {
                class ScenarioProcessor extends API.DefaultConfig {
                    onScenario(scenario) {
                        return null;
                    }
                }

                const processed = API.process(ast, new ScenarioProcessor());
                expect(processed).to.not.eql(ast);
                expect(processed.feature.elements.length).to.equal(2);
            });
        });

        describe('filters', () => {
            it('should support filtering of Tags', () => {
                class TagProcessor extends API.DefaultConfig {
                    preFilterTag(tag) {
                        return /2$/.test(tag.name);
                    }

                    onTag(tag) {
                        const newTag = tag.clone();
                        tag.name = '@tagN';
                        return [tag, newTag, newTag, newTag];
                    }

                    postFilterTag(tag, parent) {
                        return this.preFilterTag(tag, parent);
                    }
                }

                const processed = API.process(ast, new TagProcessor());

                expect(processed.feature.tags.length).to.equal(3);
                processed.feature.elements.slice(1).forEach(element => {
                    expect(element.tags.length).to.equal(3);
                    element.tags.forEach(tag => {
                        expect(tag.name).to.match(/2$/);
                    });
                });
                processed.feature.elements[2].examples.forEach(examples => {
                    expect(examples.tags.length).to.equal(3);
                    examples.tags.forEach(tag => {
                        expect(tag.name).to.match(/2$/);
                    });
                });
            });

            it('should support filtering Scenario-like elements', () => {
                class ScenarioProcessor extends API.DefaultConfig {
                    preFilterScenario(scenario) {
                        return scenario.constructor.name !== 'ScenarioOutline';
                    }
                    postFilterScenario(scenario) {
                        return scenario.constructor.name !== 'Scenario';
                    }
                }

                const processed = API.process(ast, new ScenarioProcessor());
                expect(processed.feature.elements.length).to.equal(1);
                expect(processed.feature.elements[0]).to.be.instanceOf(assembler.AST.Background);
            });

            it('should support filtering Steps', () => {
                class StepProcessor extends API.DefaultConfig {
                    preFilterStep(step, _, i) {
                        step.text = '1';
                        return i < 2;
                    }

                    postFilterStep(step, _, i) {
                        step.text += '2';
                        return i > 0;
                    }
                }

                const processed = API.process(ast, new StepProcessor());
                processed.feature.elements.forEach(element => {
                    expect(element.steps.length).to.equal(1);
                    expect(element.steps[0].text).to.equal('12');
                });
            });

            it('should support filtering Rows of dataTables of examples', () => {
                class RowProcessor extends API.DefaultConfig {
                    preFilterRow(row, _, i) {
                        row.cells = row.cells.slice(0, 1);
                        row.cells[0].value = '1';
                        return i < 2;
                    }

                    postFilterRow(row, _, i) {
                        row.cells[0].value += '2';
                        return i > 0;
                    }
                }

                const processed = API.process(ast, new RowProcessor());
                processed.feature.elements[1].steps.slice(2, 4).forEach(step => {
                    expect(step.argument.rows.length).to.equal(1);
                    expect(step.argument.rows[0].cells[0].value).to.equal('12');
                });
                processed.feature.elements[2].examples.forEach(examples => {
                    expect(examples.body.length).to.equal(1);
                    expect(examples.body[0].cells[0].value).to.equal('12');
                });
            });

            it('should support filtering Examples', () => {
                class ExamplesProcessor extends API.DefaultConfig {
                    preFilterExamples(examples) {
                        return examples.tags[0].name === '@tagE1';
                    }

                    postFilterExamples(examples) {
                        return examples.tags[0].name === '@tagE2';
                    }
                }

                const processed = API.process(ast, new ExamplesProcessor());
                expect(processed.feature.elements[2].examples.length).to.equal(0);
            });
        });

        it('should support Object configuration', () => {
            const featureProcessor = {
                onFeature(feature) {
                    feature.name = 'test';
                    feature.description = 'test';
                }
            };

            const processed = API.process(ast, featureProcessor);
            expect(processed).to.not.eql(ast);
            expect(processed.feature.name).to.equal('test');
            expect(processed.feature.description).to.equal('test');
        });
    });
});