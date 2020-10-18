export interface DeliveryOfWagon {
  deliveryId: number;
  created?: Date;
  author?: string;
  wagon?: Wagon;
  wagonType?: WagonType;
  owner?: Owner;
  customer?: Customer;
  cargoOperation?: CargoOperation;
  cargoType?: CargoType;
  cargoWeight?: number;
  loadUnloadWork?: boolean;
  shuntingWork?: number;
  startDate?: Date;
  endDate?: Date;
  memoOfDelivery?: MemoOfDelivery;
  memoOfDispatch?: MemoOfDispatch;
}

export interface Customer {
  customerId?: number;
  created?: Date;
  author?: string;
  customerName: string;
  customerFullName?: string;
  signerList?: Signer[];
}

export interface Signer {
  signerId?: number;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  initials?: string;
  customerId?: number;
}

export interface CargoOperation {
  operationId?: number;
  operation?: string;
}

export interface Owner {
  ownerId?: number;
  owner?: string;
}

export interface CargoType {
  typeId?: number;
  typeName?: string;
}

export interface Wagon {
  wagonId?: number;
  wagonNumber?: string;
  wagonType?: WagonType;
}

export interface WagonType {
  typeId?: number;
  typeName?: string;
  wagonGroup?: WagonGroup;
}

export interface WagonGroup {
  groupId?: number;
  groupName?: string;
}

export interface IndexToBaseRate {
  indexId?: number;
  relevanceDate: Date;
  indexToRate: number;
}

export interface BaseRate {
  rateId?: number;
  relevanceDate: Date;
  hours: number;
  rate: number;
  wagonGroup: WagonGroup;
}

export interface ControllerStatement {
  created?: Date;
  statementId: number;
  cargoOperation?: CargoOperation;
  customer?: Customer;
  author?: string;
  signer?: Signer;
  comment?: string;
  memoOfDispatchList?: MemoOfDispatch[];
}

export interface MemoOfDelivery {
  created?: Date;
  memoOfDeliveryId: number;
  startDate?: Date;
  cargoOperation?: CargoOperation;
  customer?: Customer;
  author?: string;
  signer?: Signer;
  comment?: string;
  deliveryOfWagonList?: DeliveryOfWagon[];
}

export interface MemoOfDispatch {
  created?: Date;
  memoOfDispatchId: number;
  endDate?: Date;
  cargoOperation?: CargoOperation;
  customer?: Customer;
  author?: string;
  signer?: Signer;
  comment?: string;
  deliveryOfWagonList?: DeliveryOfWagon[];
  controllerStatement?: ControllerStatement;
}

export interface User {
  userId: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  created: number;
  enabled: boolean;
  roles: string[];
  auths: {
    refreshTokenId: number,
    createdDate: Date
  }[];
}


