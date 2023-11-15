import { parsers } from "prettier/parser-yaml.js";

const sortKeys = (ast) => {
  if (!ast) return;
  if (ast.type === "document") {
    walkYaml(ast);
  }
  return ast;
};

const walkYaml = (node) => {
  if (node.type === "mapping") {
    if (!node.children) return;
    node.children = node.children.sort((a, b) => {
      return a.children[0].children[0].value.localeCompare(
        b.children[0].children[0].value
      );
    });
  }

  if (node.children) {
    node.children.forEach(walkYaml);
  }
};

export default {
  parsers: {
    yaml: {
      ...parsers.yaml,
      parse: (text) => {
        const ast = parsers.yaml.parse(text);
        if (ast.children && ast.children[0]) sortKeys(ast.children[0]);
        return ast;
      },
    },
  },
};
