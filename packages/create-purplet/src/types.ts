export interface ProjectConfig {
  root: string;
  'allow-empty': boolean;
  template: string;
  lang: 'ts' | 'js' | 'jsdoc';
  eslint: boolean;
  prettier: boolean;
  'no-install': boolean;
}

export interface ProjectTemplate {
  name: string;
  title: string;
  description: string;
  default: boolean;
}
