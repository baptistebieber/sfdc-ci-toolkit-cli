import {flags} from '@oclif/command'

import Base from '../command_base'
const Configstore = require('configstore');

export interface Options {
  envi: string
}

export default abstract class RetrieveCommand extends Base {
  static description = 'add a environment to an existing CLI or plugin'

  static flags = {
    env: flags.string({description: 'name of environment', required: false}),
  }
  static args = [
  ]

  async run() {
    const {flags, args} = this.parse(RetrieveCommand)
    await super.generate('retrieve', {
      envi: flags.env,
    } as Options)
  }
}