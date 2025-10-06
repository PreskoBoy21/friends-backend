import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {DbDataSource} from './datasources';

export {ApplicationConfig};

export class FriendsApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Register authentication components
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    // Configure JWT authentication to use our custom User model
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Auto-migrate database schema on startup
    this.migrateSchema();
  }

  async migrateSchema(options?: {existingSchema?: 'drop' | 'alter'}): Promise<void> {
    const existingSchema = options?.existingSchema || 'drop';
    await super.migrateSchema({existingSchema});
  }
}
