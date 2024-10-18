import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Question } from "src/modules/questions/question.entity";
import { Section } from "src/modules/section/section.entity";
import { User } from "src/modules/user/user.entity";
import { UserAnswer } from "src/modules/userAnswer/userAnswer.entity";
import { UserProgress } from "src/modules/userProgress/userProgress.entity";

export default class TypeOrmConfig {
    static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: configService.get('DATABASE_HOST'),
            port: configService.get('DATABASE_PORT'),
            username: configService.get('DATABASE_USER'),
            password: configService.get('DATABASE_PASSWORD'),
            database: configService.get('DATABASE_NAME'),
            entities: [
                __dirname + '/../**/*.entity{.ts,.js}',
                User,UserAnswer,UserProgress, Section, Question
            ],
            synchronize: false,
            logging: true,
        };
    }
}

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService):
    Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
    inject: [ConfigService]
};