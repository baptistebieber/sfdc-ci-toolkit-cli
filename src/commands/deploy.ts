import {flags} from '@oclif/command'

import Base from '../command_base'
const Configstore = require('configstore');

export interface Options {
  envi: string,
  type: string,
  from: string,
  to: string
}

export default abstract class DeployCommand extends Base {
  static description = 'add a environment to an existing CLI or plugin'

  static flags = {
    env: flags.string({description: 'name of environment', required: false}),
    from: flags.string({description: 'Git Compare From Commit/Branch', required: false}),
    to: flags.string({description: 'Git Compare To Commit/Branch', required: false}),
  }
  static args = [
    {name: 'type', description: 'type to run', required: true, default: 'full', options: ['full', 'post', 'pre', 'diff']}
  ]

  async run() {
    const {flags, args} = this.parse(DeployCommand)
    await super.generate('deploy', {
      type: args.type,
      envi: flags.env,
      from: flags.from,
      to: flags.to,
    } as Options)
  }
}