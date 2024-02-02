import { IClient } from "./IClient";

export class CreateClientResponseDTO {
    id: string;
    name: string;
    email: string;
    phone: string;
    x: number;
    y: number;

    constructor({
        email,
        name,
        phone,
        id,
        x,
        y
    }: IClient){
        this.name = name;
        this.email = email;
        this.phone = phone
        this.id = id;
        this.x = x;
        this.y = y;
    }
}