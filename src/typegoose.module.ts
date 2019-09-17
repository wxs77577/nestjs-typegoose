import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypegooseCoreModule } from './typegoose-core.module';

import {
  convertToTypegooseClassWithOptions,
  createTypegooseProviders,
  TypegooseClassWithOptions
} from './typegoose.providers';
import { TypegooseClass } from './typegoose-class.interface';
import { TypegooseModuleAsyncOptions, TypegooseConnectionOptions } from './typegoose-options.interface';
import { getModelToken } from './typegoose.utils';
import { getModelForClass } from '@hasezoey/typegoose';

@Module({})
export class TypegooseModule {
  static forRoot(
    uri: string,
    options: TypegooseConnectionOptions = {},
  ): DynamicModule {
    return {
      module: TypegooseModule,
      imports: [TypegooseCoreModule.forRoot(uri, options)],
    };
  }

  static forRootAsync(options: TypegooseModuleAsyncOptions): DynamicModule {
    return {
      module: TypegooseModule,
      imports: [TypegooseCoreModule.forRootAsync(options)],
    };
  }

  static forFeature(models: any[]): DynamicModule {
    const providers = models.map((model): Provider => ({
      provide: getModelToken(model.name),
      useFactory: () => getModelForClass(model),
    }));
    return {
      module: TypegooseModule,
      providers,
      exports: providers
    };
  }
}