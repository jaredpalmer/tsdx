import chalk from 'chalk';
import { Select } from 'enquirer';

const prompt = new Select({
  message: 'Choose a template',
  choices: ['basic', 'react', 'chrome'],
});

export async function getTemplate(opts: any, bootSpinner: any) {
  let template;
  if (opts.template) {
    template = opts.template.trim();
    if (!prompt.choices.includes(template)) {
      bootSpinner.fail(`Invalid template ${chalk.bold.red(template)}`);
      template = await prompt.run();
    }
  } else {
    template = await prompt.run();
  }
  return template;
}
