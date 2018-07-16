import {flags} from '@oclif/command'

import Base from '../command_base'

export interface Options {
  name: string
  event: string
}

export default abstract class EnvCommand extends Base {
  static description = 'add a environment to an existing CLI or plugin'

  static flags = {
    name: flags.string({description: 'name of environment'}),
  }
  static args = [
    {name: 'event', description: 'event to run', required: true, default: 'list', options: ['list', 'show', 'add', 'edit', 'delete']}
  ]

  async run() {
    const {flags, args} = this.parse(EnvCommand)
    await super.generate('env', {
      event: args.event,
      name: flags.name || '',
    } as Options)
  }
}