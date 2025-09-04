const fg = require('fast-glob');
const fs = require('fs-extra');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const regex = /^[^<>]+$/;
const removeEmoji = (str) => str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
const clean = (str) =>
  removeEmoji(str)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const isValidTextKey = (str) =>
  str.length > 2 &&
  /[a-zA-Z\u05D0-\u05EA]/.test(str) &&                    // כולל אותיות
  !/^[-\d.,:%#\\/()]+$/.test(str) &&                      // לא רק מספרים/תווים
  !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str) &&           // לא צבעי hex
  !/^\d+(px|vh|vw|rem|em|%)?$/.test(str) &&               // לא יחידות CSS
  !/^(scale|translate|rotate|clamp|var)\(/.test(str) &&   // לא transform
  !/^hsl\(/.test(str) &&
  !/^rgba?\(/.test(str) &&
  !/^[\w\-]+\/[\w\-]+(\.[a-z]+)?$/.test(str) &&           // לא נתיבי קבצים
  !/^M[\d\s\-]+[A-Z\d\s\-]*$/.test(str) &&                // לא path של SVG
  !/^import\(.+\)$/.test(str) &&                          // לא import dynamic
  !/^\/[^ ]*$/.test(str) &&                               // לא נתיבי רואטינג
  !/^en-[A-Z]{2}$/i.test(str);                            // לא מזהי שפה (כמו en-US)

const path = require('path');

async function extractText() {
  const files = await fg(['packages/frontend/src/**/*.{js,jsx,ts,tsx}']);

  const textMap = {};

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
    traverse(ast, {
      JSXText({ node }) {
        const value = clean(node.value);
        const finalVal = removeEmoji(value);
        if (finalVal && regex.test(value) && isValidTextKey(value)) {
          textMap[value] = '';
        }
      },
      ObjectProperty(path) {
        const { value } = path.node;
        if (value.type === 'StringLiteral') {
          const val = clean(value.value);
          const finalVal = removeEmoji(val);
          if (finalVal && regex.test(val) && isValidTextKey(val)) {
            textMap[val] = '';
          }
        }
      },
      JSXAttribute(path) {
        const { name, value } = path.node;
        if (
          name?.name !== 'className' &&
          name?.name !== 'target' &&
          value?.type === 'StringLiteral'
        ) {
          const val = clean(value.value);
          const finalVal = removeEmoji(val);
          if (finalVal && regex.test(val) && isValidTextKey(val)) {
            textMap[val] = '';
          }
        }
      },
      VariableDeclarator(path) {
        const { init } = path.node;
        if (init?.type === 'StringLiteral') {
          const val = clean(init.value);
          const finalVal = removeEmoji(val);
          if (finalVal && regex.test(val) && isValidTextKey(val)) {
            textMap[val] = '';
          }
        }
      },
      ArrayExpression(path) {
        for (const element of path.node.elements) {
          if (element?.type === 'StringLiteral') {
            const val = clean(element.value);
            const finalVal = removeEmoji(val);
            if (finalVal && regex.test(val) && isValidTextKey(val)) {
              textMap[val] = '';
            }
          }
        }
      },
      CallExpression(path) {
        for (const arg of path.node.arguments) {
          if (arg?.type === 'StringLiteral') {
            const val = clean(arg.value);
            const finalVal = removeEmoji(val);
            if (finalVal && regex.test(val) && isValidTextKey(val)) {
              textMap[val] = '';
            }
          }
        }
      },
    });
  }

  const dir = path.resolve(__dirname, '../packages/frontend/src/i18n/translations');
  await fs.ensureDir(dir);

  const outPath = path.join(dir, 'en.json');
  let existing = {};
  if (fs.existsSync(outPath)) {
    existing = await fs.readJson(outPath);
  }

  const merged = { ...existing, ...textMap };
  await fs.writeJson(outPath, merged, { spaces: 2 });

  console.log(`Found ${Object.keys(textMap).length} strings. Saved to ${outPath}`);
}

extractText();
