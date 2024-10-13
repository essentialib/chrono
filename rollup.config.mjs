import * as fs from "node:fs";
import chalk from "chalk";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import typescript from "@rollup/plugin-typescript";
import { getBabelOutputPlugin as babel } from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import replace from '@rollup/plugin-replace';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = createRequire(import.meta.url)("./package.json");
const allInOne = process.env.ALLINONE === "true";
const directories = packageJson.directories;

directories.dist = allInOne ? directories.dist + "/all" : directories.dist + "/preserve";

function getEntryPoints(dir) {
    const entrypoints = [];

    fs.readdirSync(dir).forEach(file => {
        const path = join(dir, file);

        if (fs.statSync(path).isDirectory()) {
            const indexFile = join(path, "index.ts");
            if (fs.existsSync(indexFile))
                entrypoints.push(indexFile);
            else
                throw new Error(`index.ts not found in ${dir}`);

            entrypoints.push(...getEntryPoints(path));
        }
    });

    return entrypoints;
}

export default () => {
    if (fs.existsSync(directories.dist)) {
        const start = Date.now();
        fs.rmSync(directories.dist, { recursive: true, force: true });
        const end = Date.now();

        console.log(chalk.green(`cleared ${chalk.bold(directories.dist)} in ${chalk.bold(end - start + "ms")}`));
    }

    return [
        {
            input: [ join(directories.lib, "index.ts"), ...(allInOne ? [] : getEntryPoints(directories.lib)) ],
            output: {
                dir: directories.dist,
                format: "cjs",
                preserveModules: !allInOne,
                preserveModulesRoot: !allInOne ? directories.lib : undefined,
                sourcemap: false
            },
            plugins: [
                typescript({
                    exclude: "**/*.test.ts",
                    compilerOptions: {
                        removeComments: true,
                        declaration: !allInOne,
                        declarationDir: !allInOne ? directories.dist : undefined,
                        target: "es2020",
                        sourceMap: false
                    }
                }),
                babel({
                    presets: [ "@babel/preset-env" ],
                    plugins: [
                        "@babel/plugin-syntax-bigint",
                        "@babel/plugin-transform-named-capturing-groups-regex",
                    ],
                }),
                replace({
                    "const IS_DIST = false": "const IS_DIST = true",
                })
            ]
        }, ...(allInOne ? [ {
            input: directories.lib + "/index.ts",
            output: {
                file: directories.dist + "/index.d.ts",
                format: "es"
            },
            plugins: [ dts() ]
        } ] : [])
    ];
};