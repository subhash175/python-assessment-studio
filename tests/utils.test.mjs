import test from 'node:test';import assert from 'node:assert/strict';import{normalize,csvCell}from'../src/utils.mjs';
test('exact mode preserves trailing newline',()=>assert.notEqual(normalize('a\n','exact'),normalize('a','exact')));
test('trim mode ignores outside whitespace and CRLF',()=>assert.equal(normalize(' \r\na\r\n ','trim'),'a'));
test('normalization collapses internal whitespace only on request',()=>{assert.equal(normalize(' a\n  b ','whitespace'),'a b');assert.equal(normalize(' a\n  b ','trim'),'a\n  b');});
test('CSV escapes delimiters, quotes and newlines',()=>assert.equal(csvCell('a,"b"\nc'),'"a,""b""\nc"'));
test('CSV neutralizes spreadsheet formula prefixes',()=>{for(const v of ['=1+1','+cmd','-2','@SUM(1)','\tformula','\rformula'])assert.ok(csvCell(v).startsWith('"\''));});
