import Command from '@oclif/command'

const createEnv = require('yeoman-environment')


export default abstract class CommandBase extends Command {
  protected async generate(type: string, generatorOptions: object = {}) {

    // generatorOptions['_conf'] = conf

    const envi = new createEnv()

    envi.register(
      require.resolve(`./generators/${type}`),
      `oclif:${type}`
    )

    await new Promise((resolve, reject) => {
      envi.run(`oclif:${type}`, generatorOptions, (err: Error, results: any) => {
        if (err) reject(err)
        else resolve(results)
      })
    })
  }
}