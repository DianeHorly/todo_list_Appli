import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
    // suppression des espaces inutiles au début et à la fin
    // afin d'enregistrer un titre propre dans la base de données.
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )

    // Je vérifie que le titre est bien un texte non vide.
    @IsString()
    @IsNotEmpty({
        message: 'Le titre de la tâche est obligatoire.',
    })

    // Je limite le titre à 255 caractères afin de respecter
    // la taille définie dans le modèle et dans la table tasks.
    @MaxLength(255, {
        message: 'Le titre ne doit pas dépasser 255 caractères.',
    })
    title!: string;
}