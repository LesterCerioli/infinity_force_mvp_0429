
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export abstract class Entity<T> {
  public readonly id: string; // GUID

  constructor(id?: string) {
    this.id = id && Entity.isValidId(id) ? id : uuidv4();
  }

  static isValidId(id: string): boolean {
    return uuidValidate(id);
  }

  equals(other: Entity<T>): boolean {
    return this.id === other.id;
  }
}