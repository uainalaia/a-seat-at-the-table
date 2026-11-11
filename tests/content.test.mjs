import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { chapterOrder, tableItems, scenario, knowledgeQuestions, reflectionQuestions } from '../src/data/learning.ts';
import { resources } from '../src/data/resources.ts';
import { isPublicHttpsUrl } from '../src/lib/submission.ts';

test('submission accepts public HTTPS addresses and rejects local or invalid addresses', () => {
  for (const value of ['https://example.edu/', 'https://my-guide.vercel.app/chapters/', '  https://example.edu/  ']) {
    assert.equal(isPublicHttpsUrl(value), true, value);
  }
  for (const value of ['', 'not a URL', 'http://example.edu/', 'https://localhost/', 'https://guide.localhost/', 'https://127.0.0.1:4321/', 'https://127.1/', 'https://[::1]/', 'https://10.0.0.1/', 'https://172.16.0.1/', 'https://192.168.1.10/', 'https://preview.local/', 'https://user:password@example.edu/']) {
    assert.equal(isPublicHttpsUrl(value), false, value);
  }
});

test('learning material meets the agreed counts and has unambiguous answers', () => {
  assert.equal(chapterOrder.length, 6);
  assert.equal(tableItems.length, 17);
  assert.equal(new Set(tableItems.map(item => item.id)).size, 17);
  assert.equal(scenario.length, 6);
  for (const step of scenario) {
    assert.equal(step.options.length, 3);
    assert.equal(step.options.filter(option => option.recommended).length, 1);
    assert.ok(chapterOrder.includes(step.chapter));
    assert.ok(resources.some(resource => resource.id === step.resourceId));
  }
  assert.equal(knowledgeQuestions.length, 6);
  assert.equal(reflectionQuestions.filter(item => item.type === 'confidence').length, 2);
  assert.equal(reflectionQuestions.filter(item => item.type === 'reflection').length, 2);
  for (const question of knowledgeQuestions) {
    assert.ok(question.correct >= 0 && question.correct < question.options.length);
    assert.ok(chapterOrder.includes(question.chapter));
  }
});

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.filter(entry => !entry.name.startsWith('.')).map(entry => entry.isDirectory() ? files(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}

test('every built internal link, asset, and fragment resolves', async () => {
  const built = await files('dist');
  const pages = built.filter(file => file.endsWith('.html'));
  assert.equal(pages.length, 14);
  for (const file of pages) {
    const html = await readFile(file, 'utf8');
    assert.match(html, /<html[^>]+lang="en"/);
    assert.match(html, /<meta[^>]+name="description"/);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file}: one descriptive h1`);
    for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const url = new URL(href, `https://example.test/${file.replaceAll('\\', '/').replace(/^dist\//, '')}`);
      let target = join('dist', decodeURIComponent(url.pathname));
      if (url.pathname.endsWith('/')) target = join(target, 'index.html');
      assert.ok((await stat(target)).isFile(), `${file} links to missing ${href}`);
      if (url.hash && target.endsWith('.html')) {
        const destination = await readFile(target, 'utf8');
        assert.ok(destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: missing fragment ${href}`);
      }
    }
  }
});
