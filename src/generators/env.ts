// tslint:disable no-floating-promises
// tslint:disable no-console
import * as _ from 'lodash'
import * as path from 'path'
import * as Generator from 'yeoman-generator'
const Configstore = require('configstore');

import {Options} from '../commands/env'

const {version} = require('../../package.json')

class EnvGenerator extends Generator {
  pjson!: any

  get _path() { return this.options.name.split(':').join('/') }
  get _ts() { return this.pjson.devDependencies.typescript }
  get _ext() { return this._ts ? 'ts' : 'js' }
  get _mocha() { return this.pjson.devDependencies.mocha }

  _conf: Configstore;

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
      default:
        break
    }
  }

  _retrieve(credentials) {

    return this.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Name of the environment: ',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter the name of the environment.';
          }
        },
        default: credentials.name
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
        default: credentials.version || 'login.salesforce.com'
      },
      {
        name: 'test_level',
        type: 'list',
        choices: ['NoTestRun','RunLocalTests','RunSpecifiedTests', 'RunAllTests'],
        message: 'Enter the test level:',
        default: credentials.version || 'RunLocalTests'
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
      }
    ]).then((answers) => {
      this._conf.set(answers.name, answers)
      this.log('app name', answers.name);
      this.log('Environment', answers.name, 'set');
    });
  }

  _list() {
    this.log('List of environment set')
    for(let key in this._conf.all) {
      this.log('-> ' + key)
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
        this.log('Environment', this.options.name, 'deleted');
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

}

export = EnvGenerator