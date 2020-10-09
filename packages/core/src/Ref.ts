export type Kind
  = { doi: string }
  | { wikipedia: string }
  | { mr: string }
  | { mathse: string }
  | { mo: string }
export type Ref = { name: string } & Kind
