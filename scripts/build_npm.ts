import { build, emptyDir } from "dnt/mod.ts";

const cmd = Deno.run({ cmd: ["git", "describe", "--tags"], stdout: "piped" });
const version = new TextDecoder().decode(await cmd.output()).trim();
cmd.close();

await emptyDir("./.npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./.npm",
  shims: {
    deno: false,
  },
  test: false,
  compilerOptions: {
    lib: ["es2021"],
  },
  package: {
    name: "safen",
    version,
    description: "Super Fast Object Validator for Javascript(& Typescript).",
    keywords: [
      "validation",
      "validator",
      "validate",
      "assert",
      "check",
      "interface",
      "type",
      "safen",
      "schema",
      "jsonschema",
      "joi",
      "ajv",
      "typescript",
    ],
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/denostack/safen.git",
    },
    bugs: {
      url: "https://github.com/denostack/safen/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("README.md", ".npm/README.md");
