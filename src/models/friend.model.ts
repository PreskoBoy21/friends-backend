import {Entity, model, property, hasMany} from '@loopback/repository';
import {Address} from './address.model';

@model()
export class Friend extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @hasMany(() => Address)
  addresses: Address[];

  constructor(data?: Partial<Friend>) {
    super(data);
  }
}

export interface FriendRelations {
  // describe navigational properties here
}

export type FriendWithRelations = Friend & FriendRelations;
