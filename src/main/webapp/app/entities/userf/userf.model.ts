import { IFamily } from 'app/entities/family/family.model';

export interface IUserf {
  id?: number;
  login?: string;
  pass?: string | null;
  name?: string | null;
  family?: IFamily | null;
}

export class Userf implements IUserf {
  constructor(
    public id?: number,
    public login?: string,
    public pass?: string | null,
    public name?: string | null,
    public family?: IFamily | null
  ) {}
}

export function getUserfIdentifier(userf: IUserf): number | undefined {
  return userf.id;
}
