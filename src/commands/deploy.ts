import {flags} from '@oclif/command'

import Base from '../command_base'
const Configstore = require('configstore');

export interface Options {
  envi: string
  type: string
}

export default abstract class DeployCommand extends Base {
  static description = 'add a environment to an existing CLI or plugin'

  static flags = {
    env: flags.string({description: 'name of environment', required: false}),
  }
  static args = [
    {name: 'type', description: 'type to run', required: true, default: 'full', options: ['full', 'post', 'pre', 'diff']}
  ]

  async run() {
    const {flags, args} = this.parse(DeployCommand)
    await super.generate('deploy', {
      type: args.type,
      envi: flags.env,
    } as Options)
  }
}