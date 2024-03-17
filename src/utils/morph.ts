/**
 * analisa os arquivos de um diretório em busca de métodos TypeScript e imprime suas assinaturas.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as tsMorph from 'ts-morph';

function getMethodSignatures(dirName: string) {
  const project = new tsMorph.Project();
  const files = fs.readdirSync(dirName);

  files.forEach((file) => {
    const filePath = path.join(dirName, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && filePath.endsWith('.ts')) {
      console.log(`Reading and analyzing file: ${filePath}`);
      const sourceFile = project.addSourceFileAtPath(filePath);
      const classes = sourceFile.getClasses();

      classes.forEach((cls) => {
        const methods = cls.getMethods();
        methods.forEach((method) => {
          const structure = method.getStructure();
          if ('name' in structure) {
            console.log(
              `${cls.getName()}.${structure.name}: ${JSON.stringify(structure.parameters)}`,
            );
          }
        });
      });
    } else if (stat.isDirectory()) {
      // Se for um diretório, chama recursivamente a função para ler seus arquivos
      getMethodSignatures(filePath);
    }
  });
}

getMethodSignatures('src');
