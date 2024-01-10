import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntitySchema, Not, DataSource, ObjectType, FindOptionsWhere } from 'typeorm';
import { User } from '../../entities/users.ts'; // Ensure this import path is correct

export interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [EntitySchema<E> | ObjectType<E>];
}

@ValidatorConstraint({ name: 'isEntityUnique', async: true })
@Injectable()
export class EntityUniqueValidator implements ValidatorConstraintInterface {
  constructor(protected readonly dataSource: DataSource) {}

  async validate<E>(value: any, args: UniqueValidationArguments<E>) {
    const [EntityClass] = args.constraints;

    const entityRepo = await this.dataSource.getRepository(EntityClass);

    const primaryKey = await entityRepo.metadata.primaryColumns[0].propertyName;

    const query = {
      [args.property]: value,
      ...(args.object[primaryKey] && {
        [primaryKey]: Not(args.object[primaryKey]),
      }),
    } as FindOptionsWhere<E>;

    const count = await entityRepo.count({ where: query });

    return count === 0;
  }

  defaultMessage<E>(args: UniqueValidationArguments<E>) {
    // If the entity is User and the field is username_or_email, customize the message
    if (args.constraints[0] === User && args.property === 'username_or_email') {
      return `The username or email '${args.value}' is already in use. Please choose another one.`;
    }
    return `A ${this.dataSource.getRepository(args.constraints[0]).metadata.tableName} with this ${
      args.property
    } already exists.`;
  }
}

export function EntityUnique<E>(
  entity: EntitySchema<E> | ObjectType<E>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: EntityUniqueValidator,
    });
  };
}

// The UsernameOrEmailUniqueValidator is removed because its functionality
// is now covered by the EntityUniqueValidator with the custom message logic.
