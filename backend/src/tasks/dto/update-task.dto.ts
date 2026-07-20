// importation des décorateurs nécessaires pour la validation des données
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class UpdateTaskDto {
    // Je rends le titre facultatif car l'utilisateur peut vouloir
    // modifier uniquement le statut de la tâche.
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty({
        message: 'Le titre de la tâche ne peut pas être vide.',
    })
    @MaxLength(255, {
        message: 'Le titre ne doit pas dépasser 255 caractères.',
    })
    title?: string;

    // Je rends aussi le statut facultatif afin de permettre
    // la modification du titre sans changer l'état de la tâche.
    @IsOptional()
    @IsBoolean({
        message: 'Le statut completé doit être un booléen.',
    })
    completed?: boolean;
}