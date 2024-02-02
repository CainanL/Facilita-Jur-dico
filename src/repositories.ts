import { database } from "./database";
import { CreateClientRequestDTO } from "./objectTransfer/CreateClientRequestDTO";
import { v4 as uuidv4 } from 'uuid';
import { ICreateClientDTO } from "./objectTransfer/ICreateClient";
import { IClient } from "./objectTransfer/IClient";
import { Injectable } from "@nestjs/common";

(async function createTableIfNotExists() {
    await database.query(`
                    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                    CREATE TABLE IF NOT EXISTS client (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        phone VARCHAR(20) NOT NULL
                    )
                `);
})()

@Injectable()
export class Repository {
    client = {
        create: async ({ name, phone, email, x, y }: ICreateClientDTO) => {
            try {
                const id = uuidv4();
                const result = await database.query("INSERT INTO client (id, name, email, phone, x, y) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, x, y", [id, name, email, phone, x, y]);
                return result.rows[0];
            } catch (error) {
                console.log(error)
                throw new Error("Data not inserted");
            }
        },
        search: async ({
            id,
            name,
            email,
            phone
        }: Partial<IClient> = {}): Promise<IClient[]> => {
            let query = 'SELECT * FROM client';
            const values = [];

            if (
                (name && name != '' && name != undefined)
                || (email && email != '' && email != undefined)
                || (phone && phone != '' && phone != undefined)
            ) {
                console.log('entrou')
                query += ' WHERE';
                if (name && name != '' && name != undefined) {
                    query += ' name = $1';
                    values.push(name);
                }
                if (email && email != '' && email != undefined) {
                    query += `${values.length > 0 ? ' AND' : ''} email = $${values.length + 1}`;
                    values.push(email);
                }
                if (phone && phone != '' && phone != undefined) {
                    query += `${values.length > 0 ? ' AND' : ''} phone = $${values.length + 1}`;
                    values.push(phone);
                }
                if (id && id != '' && id != undefined) {
                    query += `${values.length > 0 ? ' AND' : ''} id = $${values.length + 1}`;
                    values.push(id);
                }
            }
            try {

                const result = await database.query(query, values);
                if (id && id != '' && id != undefined) return result.rows[0];
                return result.rows;
            } catch (error) {
                throw new Error("Repository error!");
            }
        }
    }

};