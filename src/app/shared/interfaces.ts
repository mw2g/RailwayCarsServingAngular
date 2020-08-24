export interface DeliveryOfWagon {
  deliveryId: number;
  created?: Date;
  author?: string;
  wagon?: Wagon;
  customer?: Customer;
  cargoOperation?: CargoOperation;
  cargoWeight?: number;
  loadUnloadWork?: boolean;
  shuntingWork?: number;
  startDate?: Date;
  endDate?: Date;
  memoOfDelivery?: MemoOfDelivery;
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

export interface Wagon {
  wagonId?: number;
  wagonNumber: string;
}

export interface MemoOfDelivery {
  created?: Date;
  memoId: number;
  startDate?: Date;
  cargoOperation?: CargoOperation;
  customer?: Customer;
  author?: string;
  signer?: Signer;
  comment?: string;
  deliveryOfWagonList?: DeliveryOfWagon[];
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


