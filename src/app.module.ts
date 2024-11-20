import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchoolsModule } from './schools/schools.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { EventsModule } from './events/events.module';
import appConfig from './config/app.config';
import { AdminResources } from './config/admin.config';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { HttpModule } from '@nestjs/axios';
import { checkCode, dynamicImport } from './common/tools';
// import { AdminModuleOptions } from '@adminjs/nestjs';

const authenticate = async (username: string, password: string) => {
  if (username === '18565589052' && checkCode(password)) {
    return Promise.resolve({});
  }
  return null;
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database');
        return {
          type: 'postgres',
          ...databaseConfig,
          autoLoadEntities: true,
        };
      },
    }),
    SchoolsModule,
    UsersModule,
    CommentsModule,
    EventsModule,
    AuthModule,
    // AdminJS version 7 is ESM-only. In order to import it, you have to use dynamic imports.
    dynamicImport('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: AdminResources,
          },
          auth: {
            authenticate,
            cookieName: 'goooogo',
            cookiePassword: configService.get('cookieS'),
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: configService.get('cookieS'),
            cookie: {
              httpOnly: true,
              secure: configService.get('environment') === 'production',
              path: '/admin',
              maxAge: 3600000,
            },
          },
        }),
      }),
    ),
    ScheduleModule.forRoot(),
    TasksModule,
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
