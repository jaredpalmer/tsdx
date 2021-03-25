import { PackageJson } from 'type-fest';

interface PackageJsonExtended extends PackageJson {
  husky?: any;
  prettier?: any;
}
interface Template {
  dependencies: string[];
  name: string;
  packageJson: PackageJsonExtended;
}
