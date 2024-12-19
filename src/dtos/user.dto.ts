import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string; 

  @IsString()
  public password: string;

  @IsString()
  public role: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString()
  public password: string;
}