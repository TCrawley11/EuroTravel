import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Destination {
  id: number;
  Destination: string;
  Region: string;
  Country: string;
  Description?: string;
  Latitude?: number;
  Longitude?: number;
  Best_time_to_visit?: string;
  Average_temperature?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private destinationsSubject = new BehaviorSubject<Destination[]>([]);
  destinations$ = this.destinationsSubject.asObservable();

  // Update the destinations data
  updateDestinations(destinations: Destination[]) {
    this.destinationsSubject.next(destinations);
  }
}

