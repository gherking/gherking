'use strict';

const path = require('path');
const API = require(path.resolve('lib/index.js'));
const assembler = require('gherkin-assembler');

const expect = require('chai').expect;

describe('API', () => {
    let ast;

    before(() => {
        ast = API.load(path.resolve('test/data/base.feature'));
    });

    describe('.load()', () => {
        it('should load a GherkinDocument', () => {
            expect(ast).to.be.instanceOf(assembler.AST.GherkinDocument);
        });
    });

    describe('.process()', () => {
        it('should not do anything if no preprocessor provided', () => {
            expect(API.process(ast)).to.equal(ast);
        });

        it('should copy and not modify AST if base PreProcessor provided', () => {
            const processed = API.process(ast, new API.PreProcessor());
            expect(processed).to.not.equal(ast);
            expect(processed).to.eql(ast);
        });
    });

    describe('PreProcessor', () => {
        describe('processing events', () => {
            it('should support Feature processing', () => {
                class FeatureProcessor extends API.PreProcessor {
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
                class BackgroundProcessor extends API.PreProcessor {
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
                class ScenarioProcessor extends API.PreProcessor {
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
                class ScenarioOutlineProcessor extends API.PreProcessor {
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
                class StepProcessor extends API.PreProcessor {
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
                class TagProcessor extends API.PreProcessor {
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
                class ExamplesProcessor extends API.PreProcessor {
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
                class ExamplesProcessor extends API.PreProcessor {
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
                class ExamplesProcessor extends API.PreProcessor {
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
                class DocStringProcessor extends API.PreProcessor {
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
                class DataTableProcessor extends API.PreProcessor {
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
        });

        describe('filters', () => {
            it('should support filtering of Tags', () => {
                class TagProcessor extends API.PreProcessor {
                    preFilterTag(tag, parent) {
                        return /2$/.test(tag.name);
                    }

                    onTag(tag, parent) {
                        parent.tags.push(tag.clone());
                        parent.tags.push(tag.clone());
                        parent.tags.push(tag.clone());
                        tag.name = '@tagN';
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
                class ScenarioProcessor extends API.PreProcessor {
                    preFilterScenario(scenario, parent) {
                        return scenario.constructor.name !== 'ScenarioOutline';
                    }
                    postFilterScenario(scenario, parent) {
                        return scenario.constructor.name !== 'Scenario';
                    }
                }

                const processed = API.process(ast, new ScenarioProcessor());
                expect(processed.feature.elements.length).to.equal(1);
                expect(processed.feature.elements[0]).to.be.instanceOf(assembler.AST.Background);
            });

            it('should not filter Background', () => {
                class ScenarioProcessor extends API.PreProcessor {
                    preFilterScenario(scenario, parent) {
                        return scenario.constructor.name !== 'Background';
                    }
                }

                const processed = API.process(ast, new ScenarioProcessor());
                expect(processed.feature.elements.length).to.equal(3);
                expect(processed.feature.elements[0]).to.be.instanceOf(assembler.AST.Background);
            })
        });
    });
});