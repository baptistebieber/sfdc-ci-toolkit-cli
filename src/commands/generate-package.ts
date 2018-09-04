import {flags} from '@oclif/command'

import Base from '../command_base'
const Configstore = require('configstore');

export interface Options {
  envi: string
}

export default abstract class GeneratePackageCommand extends Base {
  static description = 'Generate the package.xml of the src'

  static flags = {
    env: flags.string({description: 'name of environment', required: false}),
  }
  static args = [
  ]

  async run() {
    const {flags, args} = this.parse(GeneratePackageCommand)
    await super.generate('generate-package', {
      envi: flags.env,
    } as Options)
  }
}