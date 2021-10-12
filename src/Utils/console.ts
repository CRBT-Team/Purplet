export class CRBTErr extends Error {
  constructor(args: any) {
    super(args)

    this.name = "[ CRBT Framework Error ]"
  }
}