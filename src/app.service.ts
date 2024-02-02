import { Injectable } from '@nestjs/common';
import { ICreateClientDTO } from './objectTransfer/ICreateClient';
import { Repository } from './repositories';
import { IClient } from './objectTransfer/IClient';
import { TCoords } from './common/types/TCoords';

@Injectable()
export class AppService {

  constructor(private repository: Repository) { }

  async createClient(client: ICreateClientDTO) {
    try {
      return await this.repository.client.create(client);
    } catch (error) {
      throw error;
    };
  }

  async searchClient(client: Partial<IClient>) {
    try {
      return await this.repository.client.search(client);
    } catch (error) {
      throw error;
    }
  }

  async generateRoute(startPointClientId: string) {
    try {
      const clients = await this.repository.client.search();
      const client = clients.find(item => item.id == startPointClientId);
      return this.calculateRout(clients, client)
    } catch (error) {
      throw error;
    }
  }

  private calculateDistance(startPoint: TCoords, endPoint: TCoords) {
    return Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2));
  }

  private findNearestClient(basePoint: TCoords, clients: IClient[]) {
    let shorterDistance = Infinity;
    let nearestClient: IClient = null;

    for (const client of clients) {
      const distance = this.calculateDistance(basePoint, {
        x: client.x,
        y: client.y
      });

      if (distance < shorterDistance) {
        shorterDistance = distance;
        nearestClient = client;
      }
    }
    return nearestClient;
  }

  private calculateRout(clients: IClient[], startClientCoords: TCoords) {
    const route = [];
    let currentClientCoords = startClientCoords;

    while (clients.length > 0) {
      const nextClient = this.findNearestClient(currentClientCoords, clients);
      route.push(nextClient);
      clients = clients.filter(client => client !== nextClient);
      currentClientCoords = nextClient;
    }
    return route.concat(startClientCoords);
  }
}
