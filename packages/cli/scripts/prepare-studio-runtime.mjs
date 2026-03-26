import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(scriptDir, '..');
const webRoot = path.resolve(cliRoot, '../web');
const runtimeRoot = path.join(cliRoot, 'studio-runtime');

const copiedEntries = [
  'app',
  'components',
  'lib',
  'public',
  'themes',
  'utils',
  'next.config.mjs',
  'postcss.config.mjs',
  'tailwind.config.mjs',
];

const runtimeTsconfig = {
  compilerOptions: {
    target: 'ES2017',
    lib: ['dom', 'dom.iterable', 'esnext'],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    isolatedModules: true,
    allowImportingTsExtensions: true,
    jsx: 'react-jsx',
    incremental: true,
    plugins: [{ name: 'next' }],
    paths: {
      '@/*': ['./*'],
    },
  },
  include: [
    'next-env.d.ts',
    '**/*.ts',
    '**/*.tsx',
    '**/*.mts',
    '.next/types/**/*.ts',
    '.next/dev/types/**/*.ts',
  ],
  exclude: ['node_modules', 'examples', 'tests', 'demo'],
};

const runtimePackageJson = {
  name: '@anydocs/cli-studio-runtime',
  private: true,
  type: 'module',
};

async function main() {
  await rm(runtimeRoot, { recursive: true, force: true });
  await mkdir(runtimeRoot, { recursive: true });

  for (const entry of copiedEntries) {
    await cp(path.join(webRoot, entry), path.join(runtimeRoot, entry), {
      recursive: true,
      force: true,
    });
  }

  await writeFile(
    path.join(runtimeRoot, 'next-env.d.ts'),
    '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// This file is generated for the packaged Studio runtime.\n',
    'utf8',
  );
  await writeFile(path.join(runtimeRoot, 'tsconfig.json'), `${JSON.stringify(runtimeTsconfig, null, 2)}\n`, 'utf8');
  await writeFile(
    path.join(runtimeRoot, 'package.json'),
    `${JSON.stringify(runtimePackageJson, null, 2)}\n`,
    'utf8',
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
