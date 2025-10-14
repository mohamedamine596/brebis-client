export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Investment {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Payment {
    id: string;
    userId: string;
    investmentId: string;
    amount: number;
    paymentDate: Date;
    status: string;
}