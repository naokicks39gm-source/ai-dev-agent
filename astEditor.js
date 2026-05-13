import fs from "fs";
import parser from "@babel/parser";
import * as generatorMod from "@babel/generator";

export function addImport(filePath, sourceValue, localName) {
  const code = fs.readFileSync(filePath, "utf-8");

  const ast = parser.parse(code, {
    sourceType: "module"
  });

  const importNode = {
    type: "ImportDeclaration",
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
        local: {
          type: "Identifier",
          name: localName
        }
      }
    ],
    source: {
      type: "StringLiteral",
      value: sourceValue
    }
  };

  ast.program.body.unshift(importNode);

  const output =
    generatorMod.default.generate(ast, {}).code;

  fs.writeFileSync(filePath, output, "utf-8");

  return { file: filePath, status: "import_added" };
}
