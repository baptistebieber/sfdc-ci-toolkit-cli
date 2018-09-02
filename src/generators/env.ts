// tslint:disable no-floating-promises
// tslint:disable no-console
import * as _ from 'lodash'
import * as path from 'path'
import * as Generator from 'yeoman-generator'
const Configstore = require('configstore');

// const EnvClass = require('../base_environment')

interface EnvInterface {
  name?: string;
  username?: string;
  password?: string;
  token?: string;
  version?: string;
  server_url?: string;
  test_level?: string;
  root_path?: string;
  src_relative_path?: string;
  tmp_relative_path?: string;
}

import {Options} from '../commands/env'

const {version} = require('../../package.json')

const restricted_name = [
  'all',
  'default'
]

const valid_env_name = (name) => {
  return restricted_name.indexOf(name) == -1
}

module.exports = class EnvGenerator extends Generator {
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
    switch(this.options.event) {
      case 'list':
        this._list()
        break
      case 'show':
        this._show()
        break
      case 'add':
        this._add()
        break
      case 'edit':
        this._edit()
        break
      case 'delete':
        this._delete()
        break
      case 'clear':
        this._clear()
        break
      case 'import':
        this._import()
        break
      case 'export':
        this._export()
        break
      case 'default':
        this._default()
        break
      default:
        break
    }
  }

  _retrieve(credentials: EnvInterface) {
    return this.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Name of the environment: ',
        validate: function( value ) {
          if (value.length && valid_env_name(value)) {
            return true;
          } else {
            return 'Please enter the name of the environment.';
          }
        },
        default: credentials.name || null
      },
      {
        name: 'username',
        type: 'input',
        message: 'What is your username: ',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your username or e-mail address.';
          }
        },
        default: credentials.username
      },
      {
        name: 'password',
        type: 'password',
        message: 'What is your password:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter password.';
          }
        },
        default: credentials.password
      },
      {
        name: 'token',
        type: 'password',
        message: 'What is your token:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your token.';
          }
        },
        default: credentials.token
      },
      {
        name: 'version',
        type: 'list',
        choices: ['41.0','42.0','43.0'],
        message: 'Enter your version:',
        default: credentials.version || '42.0'
      },
      {
        name: 'server_url',
        type: 'input',
        message: 'Enter your server url:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your server url.';
          }
        },
        default: credentials.server_url || 'login.salesforce.com'
      },
      {
        name: 'test_level',
        type: 'list',
        choices: ['NoTestRun','RunLocalTests','RunSpecifiedTests', 'RunAllTests'],
        message: 'Enter the test level:',
        default: credentials.test_level || 'RunLocalTests'
      },
      {
        name: 'root_path',
        type: 'input',
        message: 'Enter the root path:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter root path.';
          }
        },
        default: credentials.root_path || process.cwd()
      },
      {
        name: 'src_relative_path',
        type: 'input',
        message: 'Enter the src relative path:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter root path.';
          }
        },
        default: credentials.src_relative_path || '/src'
      },
      {
        name: 'tmp_relative_path',
        type: 'input',
        message: 'Enter the temporary relative path:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter root path.';
          }
        },
        default: credentials.tmp_relative_path || '/tmp'
      }
    ]).then((answers) => {
      this._conf.set(answers.name, answers)
      this.log('app name', answers.name);
      this.log('Environment ' + answers.name + ' set');
    });
  }

  _list() {
    let d = (this._conf.has('default') ? this._conf.get('default') : '');
    this.log('List of environment set')
    for(let key in this._conf.all) {
      if(valid_env_name(key)) {
        this.log('-> ' + key + (key == d ? ' (default)' : ''))
      }
    }
  }

  _show() {
    this.log('show just ran')
    if(this.options.name == '') {
      throw new Error('You need to define the environment wanted');
    }
    if(!this._conf.has(this.options.name)) {
      throw new Error('The environment doesn\'t exist');
    }
    this.log(this._conf.get(this.options.name))
  }

  _add() {
    if(!valid_env_name(this.options.name)) {
      throw new Error('You can\'t use this name');
    }
    if(this._conf.has(this.options.name)) {
      throw new Error('The environment already exist');
    }
    this.log('add just ran')
    let credentials = {
      name: this.options.name
    }
    this._retrieve(credentials)
  }

  _edit() {
    this.log('edit just ran')
    if(this.options.name == '') {
      throw new Error('You need to define the environment wanted');
    }
    if(!this._conf.has(this.options.name)) {
      throw new Error('The environment doesn\'t exist');
    }
    let credentials = this._conf.get(this.options.name)
    this._retrieve(credentials)
  }

  _delete() {
    this.log('delete just ran')
    if(this.options.name == '') {
      throw new Error('You need to define the environment wanted');
    }
    if(!this._conf.has(this.options.name)) {
      throw new Error('The environment doesn\'t exist');
    }
    this.prompt([
      {
        name: 'delete',
        type: 'confirm',
        message: 'Are you sure to delete this environment "' + this.options.name + '": ',
        default: true
      }
    ]).then((answers) => {
      if(answers.delete) {
        this._conf.delete(this.options.name)
        this.log('Environment ' + this.options.name + ' deleted');
      }
    });
    
  }

  _clear() {
    this.log('clear just ran')
    this.prompt([
      {
        name: 'clear',
        type: 'confirm',
        message: 'Are you sure to clear all environments',
        default: false
      }
    ]).then((answers) => {
      if(answers.delete) {
        this._conf.clear(this.options.name)
      }
    });
  }

  _export() {
    this.log('export just ran')
  }

  _import() {
    this.log('import just ran')
  }

  _default() {
    if(this.options.name == '') {
      if(this._conf.has('default')) {
        this.log('The default env is: ' + this._conf.get('default'))
      }
      else {
        this.log('There are no default env.')
      }
    }
    else {
      if(!this._conf.has(this.options.name)) {
        throw new Error('The environment doesn\'t exist');
      }
      else {
        this._conf.set('default',this.options.name)
        this.log('The default env is now: ' + this._conf.get('default'))
      }
    }
  }

}
