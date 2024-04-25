export abstract class InvalidGameCommand {}

export class InvalidPlayOrder extends InvalidGameCommand {}

export class InvalidMultiDrawToken extends InvalidGameCommand {}

export class InvalidDrawTokenAmount extends InvalidGameCommand {}

export class InvalidOverdrawToken extends InvalidGameCommand {}

export class InvalidTurnCommand extends InvalidGameCommand {}

export class InvalidTokenReturn extends InvalidGameCommand {}
