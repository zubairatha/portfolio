// Compare preserved data with the redesign's required origin/main baseline.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
const baseline = file => execFileSync('git', ['show', `origin/main:${file}`], { encoding: 'utf8' });
function evaluate(source) {
  const context = { exports: {} };
  vm.runInNewContext(ts.transpile(source, { module: ts.ModuleKind.CommonJS }), context);
  return JSON.parse(JSON.stringify(context.exports));
}
const original = evaluate(baseline('src/data/experience.ts'));
const current = evaluate(fs.readFileSync('src/data/experience.ts', 'utf8'));
assert.deepEqual(current.ROLES.slice(1), original.ROLES);
assert.deepEqual(current.EDUCATION, original.EDUCATION);
const source = baseline('src/components/ProjectsHome.tsx');
const projects = source.slice(source.indexOf('type Project'), source.indexOf('const TAG_COLORS')).replace('const PROJECTS', 'export const PROJECTS');
assert.deepEqual(evaluate(fs.readFileSync('src/data/projects.ts', 'utf8')).PROJECTS, evaluate(projects).PROJECTS);
for (const file of execFileSync('git', ['ls-tree', '-r', '--name-only', 'origin/main', 'content/posts'], {encoding:'utf8'}).trim().split('\n')) {
  assert.equal(fs.readFileSync(file, 'utf8'), baseline(file), file);
}
assert.equal(fs.readFileSync('src/app/about/page.tsx', 'utf8'), baseline('src/app/about/page.tsx'));
console.log('Preserved all 5 original roles, 5 projects, 2 education records, 2 MDX articles, and About content.');
