import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  // Je vérifie que le prénom est une chaîne non vide
  // et qu'il respecte la taille prévue dans la base de données.
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  // Je rends le nom obligatoire afin de conserver
  // les informations principales de l'utilisateur.
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  // Je vérifie que l'utilisateur fournit une adresse email valide.
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  // Ce champ me permet de vérifier que l'adresse email
  // a été saisie correctement deux fois.
  @IsEmail()
  @IsNotEmpty()
  emailConfirmation!: string;

  // J'impose une longueur minimale de 8 caractères pour éviter
  // les mots de passe trop courts.
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  // Ce champ me permet de comparer les deux mots de passe.
  @IsString()
  @IsNotEmpty()
  passwordConfirmation!: string;
}