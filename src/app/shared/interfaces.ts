export interface DeliveryOfWagon {
    deliveryId: number;
    created?: Date;
    author?: string;
    wagon?: string;
    wagonType?: string;
    owner?: string;
    customer?: string;
    cargoOperation?: string;
    cargoType?: string;
    cargoWeight?: number;
    loadUnloadWork?: boolean;
    shuntingWorks?: number;
    startDate?: Date;
    endDate?: Date;
    memoOfDelivery?: number;
    memoOfDispatch?: number;
    calculation?: Calculation;
}

export interface Calculation {
    totalTime: number;
    calculationTime?: number;
    payTime?: number;
    paySum?: number;
    penaltyTime?: number;
    penaltySum?: number;
    shuntingWorkTime?: number;
    shuntingWorkSum?: number;
    totalSum?: number;
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
    operationName?: string;
}

export interface Owner {
    ownerId?: number;
    ownerName?: string;
}

export interface CargoType {
    typeId?: number;
    typeName?: string;
}

export interface Wagon {
    wagonId?: number;
    wagonNumber?: string;
    // wagonType?: WagonType;
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

export interface TimeNormType {
    typeId?: number;
    typeName?: string;
    typeCode?: string;
}

export interface TimeNorm {
    normId?: number;
    relevanceDate: Date;
    norm: number;
    normType: TimeNormType;
}

export interface TariffType {
    typeId?: number;
    typeName?: string;
    typeCode?: string;
}

export interface Setting {
    settingId?: number;
    settingType?: string;
    settingValue?: string;
}

export interface Tariff {
    tariffId?: number;
    relevanceDate: Date;
    tariff: number;
    tariffType: TariffType;
}

export interface Penalty {
    penaltyId?: number;
    relevanceDate: Date;
    penalty: number;
    wagonType: WagonType;
}

export interface BaseRate {
    rateId?: number;
    relevanceDate: Date;
    hours: number;
    rate: number;
    wagonGroup: WagonGroup;
}

export interface StatementWithRate {
    statement: Statement;
    rate: StatementRate;
}

export interface StatementRate {
    deliveryDispatchTimeNorm: TimeNorm;
    turnoverTimeNorm: TimeNorm;
    deliveryDispatchTariff: Tariff;
    shuntingTariff: Tariff;
    loadUnloadTariff: Tariff;
    indexToBaseRate: IndexToBaseRate;
}

export interface Statement {
    created?: Date;
    statementId: number;
    cargoOperation?: string;
    customer?: Customer;
    author?: string;
    signer?: string;
    comment?: string;
    memoOfDispatchList?: MemoOfDispatch[];
}

export interface MemoOfDelivery {
    created?: Date;
    memoOfDeliveryId: number;
    startDate?: Date;
    cargoOperation?: string;
    customer?: Customer;
    author?: string;
    signer?: string;
    comment?: string;
    deliveryOfWagonList?: DeliveryOfWagon[];
}

export interface MemoOfDispatch {
    created?: Date;
    memoOfDispatchId: number;
    endDate?: Date;
    cargoOperation?: string;
    customer?: Customer;
    author?: string;
    signer?: string;
    comment?: string;
    deliveryOfWagonList?: DeliveryOfWagon[];
    statement?: number;
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

export interface StaticReportRow {
    customer: string;
    operation: string;
    cargoType: string;
    wagonType: string;
    deliveryWagonQuantity: string;
    deliveryWeightSum: string;
    dispatchWagonQuantity: string;
    dispatchWeightSum: string;
    loadUnloadWorkQuantity: string;
    loadUnloadWorkWeightSum: string;
    customerLoadUnloadWorkQuantity: string;
    customerLoadUnloadWorkWeightSum: string;
    notEndDelivery: string;
    withoutOperation: string;
}

export interface GeneralSetReportRow {
    customer: string;
    operation: string;
    cargoType: string;
    dispatchWeightSum: number;
    dispatchWagonQuantity: number;
    deliveryDispatchSum: number;
    totalTime: number;
    exactCalcTime: number;
    calcTime: number;
    maxPayTime: number;
    exactPayTime: number;
    payTime: number;
    draftPaySum: number;
    paySum: number;
    penaltyTime: number;
    penaltySum: number;
    shuntingWork: number;
    shuntingWorkSum: number;
    totalSum: number;
    loadUnloadWorkQuantity: number;
    loadUnloadWorkWeightSum: number;
    loadUnloadWorkSum: number;
}


