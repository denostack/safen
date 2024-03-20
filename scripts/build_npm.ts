import { build, emptyDir } from "dnt/mod.ts";

const cmd = new Deno.Command(Deno.execPath(), {
  args: ["git", "describe", "--tags"],
  stdout: "piped",
});
const { stdout } = await cmd.output();
const version = new TextDecoder().decode(stdout).trim();

await emptyDir("./.npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./.npm",
  shims: {
    deno: false,
  },
  test: false,
  compilerOptions: {
    lib: ["ES2021", "DOM"],
  },
  package: {
    name: "safen",
    version,
    description: "Super Fast Object Validator for Javascript(& Typescript).",
    keywords: [
      "validation",
      "validator",
      "validate",
      "sanitizer",
      "sanitize",
      "assert",
      "check",
      "type",
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
