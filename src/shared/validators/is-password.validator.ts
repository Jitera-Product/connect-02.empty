import { ValidateBy, ValidationArguments, ValidationOptions } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import configs from '@configs/index';

const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/; // At least 10 characters, at least one letter and one number

const passwordValidationMessage = (args: ValidationArguments) => {
  return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long and contain both letters and numbers.`;
};

const configService = new ConfigService(configs());

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsPassword',
      constraints: [configService.get('authentication.passwordPattern', '')],
      validator: {
        validate(value: string, args: ValidationArguments) {
        validate(value: string, args?: ValidationArguments) {
          if (!passwordPattern) return true;

          if (passwordPattern instanceof RegExp) {
            return passwordPattern.test(value);
          }
          const regex = new RegExp(passwordPattern);
          return regex.test(value);
          // Check if password meets the minimum length and regex requirements
          return (
            value.length >= PASSWORD_MIN_LENGTH &&
            PASSWORD_REGEX.test(value)
          );

        defaultMessage(validationArguments?: ValidationArguments): string {
          const passwordPattern: string = validationArguments.constraints[0] || '';
          // Use custom validation message
          return passwordValidationMessage(validationArguments);
      },
    },
    validationOptions,
  );
}
