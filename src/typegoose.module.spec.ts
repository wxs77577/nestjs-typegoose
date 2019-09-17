import { TypegooseModule } from './typegoose.module';
import { TypegooseCoreModule as CoreModule } from './typegoose-core.module';
import { prop } from '@hasezoey/typegoose';
import * as createProviders from './typegoose.providers';

class MockTask {
  @prop()
  description: string;
}

class MockUser {
  @prop()
  name: string;
}


describe('TypegooseModule', () => {

  describe('forRoot', () => {
    it('should call global CoreModule forRoot', () => {
      jest.spyOn(CoreModule, 'forRoot').mockImplementation(() => ({
        providers: 'DbConnection'
      } as any));

      const module = TypegooseModule.forRoot('mongourl', { db: 'db settings' });

      expect(module).toEqual({
        module: TypegooseModule,
        imports: [
          {
            providers: 'DbConnection'
          }
        ]
      });

      expect(CoreModule.forRoot).toHaveBeenCalledWith('mongourl', { db: 'db settings' })
    });

    it('should call global CoreModule forRoot with empty config', () => {
      jest.spyOn(CoreModule, 'forRoot').mockImplementation(() => ({
        providers: 'DbConnection'
      } as any));

      TypegooseModule.forRoot('mongourl');

      expect(CoreModule.forRoot).toHaveBeenCalledWith('mongourl', {});
    });
  });

  describe('forRootAsync', () => {
    it('should call global CoreModule forRoot', () => {
      jest.spyOn(CoreModule, 'forRootAsync').mockImplementation(() => ({
        providers: 'DbConnection'
      } as any));

      const options = {
        useFactory: () => {
          return {
            uri: 'mongourl',
            db: 'db settings'
          };
        }
      }

      const module = TypegooseModule.forRootAsync(options);

      expect(module).toEqual({
        module: TypegooseModule,
        imports: [
          {
            providers: 'DbConnection'
          }
        ]
      });

      expect(CoreModule.forRootAsync).toHaveBeenCalledWith(options);
    });
  });

  describe('forFeature', () => {
    let models;
    beforeEach(() => {
      models = [
        MockTask,
        MockUser
      ];
    });

    it('should return module that exports providers for models', () => {
      const module = TypegooseModule.forFeature(models);
      expect(module.providers).toHaveLength(2)
    });
  });
});