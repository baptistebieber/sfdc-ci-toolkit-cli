// tslint:disable no-floating-promises
// tslint:disable no-console
import * as _ from 'lodash'
import * as path from 'path'
import * as Generator from 'yeoman-generator'
const Configstore = require('configstore');

import {Options} from '../commands/generate-package'

const {version} = require('../../package.json')

const sfdcMetadata = require('sfdc-extended-metadata');

const PLUGIN_NAME = 'generate-package';

module.exports = class GeneratePackageGenerator extends Generator {
  pjson!: any
  _conf: typeof Configstore;

  get _ts() { return this.pjson.devDependencies.typescript }
  get _ext() { return this._ts ? 'ts' : 'js' }
  get _mocha() { return this.pjson.devDependencies.mocha }


  constructor(args: any, public options: Options) {
    super(args, options)
    this._conf = new Configstore('sfdc-ci-toolkit-cli', {})
  }

  async execute() {
    this._generate()
  }

  _generate() {
    this.log('Execute Generate')

    if((this.options.envi == '' || this.options.envi == undefined) && this._conf.has('default')) {
      this.log('Default env used: '+ this._conf.get('default'))
      this.options.envi = this._conf.get('default')
    }
    else {
      this.log('Env used: ', this.options.envi)
    }

    if(!this._conf.has(this.options.envi)) {
      throw new Error('The environment doesn\'t exist');
    }

    let env = this._conf.get(this.options.envi);

    let config = {
      username: env.username,
      password: env.password + env.token,
      loginUrl: env.server_url,
      version: env.version,
      src: env.root_path + '/' + env.src_relative_path,
      tmp: env.root_path + '/' + env.tmp_relative_path,
      pollTimeout: 5000*1000,
      pollInterval: 10*1000,
      singlePackage: true,
      verbose: true,
      logger: console,
      indent: env.indent || '    '
    };

    Promise.all([sfdcMetadata.composeData(config.src, config.tmp, config)])
    .then(res => { 
        Promise.all([sfdcMetadata.generatePackage(config.tmp, config.src, config)])
        .then(res => { 
            this.log(PLUGIN_NAME+': DONE');
          }
        )
        .catch(err => {
          this.log('Error '+PLUGIN_NAME+': '+err.message);
        })
      }
    )
    .catch(err => {
      this.log('Error '+PLUGIN_NAME+': '+err.message);
    })

  }

}
