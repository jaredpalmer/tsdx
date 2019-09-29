import { commonDeps } from '../../constants';
import { chromeDeps, reactDeps, basicDeps } from '../../generators';
import { TemplateTypes } from '../../types';

const depsStrategy = {
  chrome: chromeDeps,
  react: reactDeps,
  basic: basicDeps,
};

export function getDeps(tempalte: TemplateTypes) {
  return [...commonDeps, ...depsStrategy[tempalte]];
}
