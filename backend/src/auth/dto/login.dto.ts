import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  // Je vérifie que l'utilisateur saisit une adresse email valide
  // avant de rechercher son compte dans la base de données.
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  // Je rends le mot de passe obligatoire afin de pouvoir
  // le comparer avec le mot de passe haché enregistré.
  @IsString()
  @IsNotEmpty()
  password!: string;
}