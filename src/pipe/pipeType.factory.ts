import { createPrinter, factory, NodeFlags, SyntaxKind } from "typescript";
import type * as ts from "typescript";

const f = factory;

function rangeMap<T>(s: number, e: number, proj: (n: number) => T): T[] {
  const ts = new Array<T>(e - s + 1);
  for (let i = s; i <= e; i++) ts[i - s] = proj(i);
  return ts;
}

const charA = "A".charCodeAt(0);
const char = (n: number) => String.fromCharCode(charA + n);
const charCode = (n: number): string =>
  n < 26 ? char(n) : `${charCode((n / 26 - 1) | 0)}${char(n % 26 | 0)}`;

const genericType = (n: number): ts.TypeParameterDeclaration =>
  f.createTypeParameterDeclaration([], charCode(n));

const opParam = (n: number): ts.ParameterDeclaration =>
  f.createParameterDeclaration(
    [],
    undefined,
    `aOp_${n}`,
    undefined,
    f.createTypeReferenceNode("LO", [
      f.createTypeReferenceNode(charCode(n)),
      f.createTypeReferenceNode(charCode(n + 1)),
    ])
  );

const pipeFuncDecl = (n: number): ts.TypeElement =>
  f.createCallSignature(
    n === 0 ? [] : rangeMap(0, n, genericType),
    rangeMap(0, n - 1, opParam),
    f.createFunctionTypeNode(
      n === 0 ? [genericType(0)] : [],
      [
        f.createParameterDeclaration(
          [],
          undefined,
          "z",
          undefined,
          f.createTypeReferenceNode("Lazy", [
            f.createTypeReferenceNode(charCode(0)),
          ])
        ),
      ],
      f.createTypeReferenceNode("Lazy", [
        f.createTypeReferenceNode(charCode(n)),
      ])
    )
  );

const pipeDecl = (n: number): ts.Statement =>
  f.createInterfaceDeclaration(
    [f.createToken(SyntaxKind.ExportKeyword)],
    "Pipe",
    undefined,
    undefined,
    rangeMap(0, n, pipeFuncDecl)
  );

const spoutFuncDecl = (n: number): ts.TypeElement =>
  f.createCallSignature(
    n === 0 ? [] : rangeMap(0, n, genericType),
    rangeMap(0, n - 1, opParam),
    f.createFunctionTypeNode(
      n === 0
        ? [genericType(0), f.createTypeParameterDeclaration([], "R")]
        : [f.createTypeParameterDeclaration([], "R")],
      [
        f.createParameterDeclaration(
          [],
          undefined,
          "aRed",
          undefined,
          f.createTypeReferenceNode("LR", [
            f.createTypeReferenceNode(charCode(n)),
            f.createTypeReferenceNode("R"),
          ])
        ),
      ],
      f.createFunctionTypeNode(
        [],
        [
          f.createParameterDeclaration(
            [],
            undefined,
            "z",
            undefined,
            f.createTypeReferenceNode("Lazy", [
              f.createTypeReferenceNode(charCode(0)),
            ])
          ),
        ],
        f.createTypeReferenceNode("R")
      )
    )
  );

const spoutDecl = (n: number): ts.Statement =>
  f.createInterfaceDeclaration(
    [f.createToken(SyntaxKind.ExportKeyword)],
    "Spout",
    undefined,
    undefined,
    rangeMap(0, n, spoutFuncDecl)
  );

const entries = 25;

const source = f.createSourceFile(
  [pipeDecl(entries), spoutDecl(entries)],
  f.createToken(SyntaxKind.EndOfFileToken),
  NodeFlags.None
);

const printer = createPrinter();
const printedSource = printer.printFile(source);

console.log(printedSource); // const testVar: string = "test";
