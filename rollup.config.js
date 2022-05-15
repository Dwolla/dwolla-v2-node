import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

export default [
    {
        input: "./src/index.ts",
        output: [
            {
                file: "./bundle/dwolla-v2.js",
                format: "cjs"
            },
            {
                file: "./bundle/dwolla-v2.mjs",
                format: "esm"
            }
        ],
        plugins: [
            json(),
            typescript({
                tsconfig: "./tsconfig.json",
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false
                    }
                }
            })
        ],
        external: ["class-transformer", "form-data", "form-urlencoded", "node-fetch", "reflect-metadata"]
    },
    {
        input: "./build/dts/src/index.d.ts",
        output: {
            file: "./bundle/dwolla-v2.d.ts",
            format: "es"
        },
        plugins: [dts()]
    }
];
