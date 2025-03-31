import { Component, NgModule, OnInit, Output, EventEmitter } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { NgModel, FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import L from 'leaflet';
import { DestinationService } from '../../services/destination.service';
import { MapComponent } from "../map/map.component";

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

interface MapDestination {
  id: number;
  Destination: string;
  Region: string;
  Country: string;
  Latitude: number;
  Longitude: number;
}

interface ExpandedDestination extends Destination {
  expanded?: boolean;
}

@Component({
  selector: 'app-destination-search',
  standalone: true,
  template: `
    <div class="bg-slate-600 shadow-md rounded-lg p-4 sm:p-6 my-4 mx-auto max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      <!-- Search Inputs -->
      <div>
        <h2 class="text-lg font-semibold mb-2 text-white">Find Destinations</h2>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input 
            type="text" 
            [(ngModel)]="searchName"
            placeholder="Destination Name"
            class="p-2 border rounded w-full"
          />
          <input 
            type="text" 
            [(ngModel)]="searchRegion"
            placeholder="Region"
            class="p-2 border rounded w-full"
          />
          <input 
            type="text" 
            [(ngModel)]="searchCountry"
            placeholder="Country"
            class="p-2 border rounded w-full"
          />
          <input 
            type="number" 
            [(ngModel)]="resultLimit"
            min="1"
            placeholder="Max Results"
            class="p-2 border rounded w-full"
          />
        </div>
        
        <div class="mt-2">
          <button 
            class="bg-black text-white p-2 rounded w-full hover:bg-gray-800 transition-colors duration-300 ease-in-out"
            (click)="searchDestinations()"
          >
            Search Destinations
          </button>
        </div>
        <div class="mt-4">
    <button 
    (click)="clearResults()"
    class="bg-red-500 text-white p-2 rounded w-full sm:w-auto hover:bg-red-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-75">
      Clear Results
    </button>
  </div>
      </div>

      <div class="mt-4">
      <div class="mt-4">
        <app-map 
          [destinations]="getMapDestinations()"
        ></app-map>
      </div>
      </div>

      <!-- Results Grid -->
      <div 
      id="resultsGrid"
      class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ng-container *ngFor="let destination of destinations">
          <div 
            class="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105"
          >
            <div 
              class="p-4 cursor-pointer"
              (click)="toggleDestinationDetails(destination)"
            >
              <h3 class="font-bold text-lg truncate">{{ destination.Destination }}</h3>
              <p class="text-gray-600 truncate">{{ destination.Country }}, {{ destination.Region }}</p>
            </div>

            <!-- Expandable Details -->
            <div 
              *ngIf="destination.expanded" 
              class="p-4 bg-gray-50 border-t transition-all duration-300"
            >
              <div *ngIf="destination.Description" class="mb-2">
                <strong>Description:</strong> 
                <p class="text-sm">{{ destination.Description }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div *ngIf="destination.Best_time_to_visit">
                  <strong>Best Time to Visit:</strong>
                  <p>{{ destination.Best_time_to_visit }}</p>
                </div>
                <div *ngIf="destination.Average_temperature">
                  <strong>Avg. Temperature:</strong>
                  <p>{{ destination.Average_temperature }}°C</p>
                </div>
                <div *ngIf="destination.Latitude && destination.Longitude">
                  <strong>Coordinates:</strong>
                  <p>{{ destination.Latitude }}° N, {{ destination.Longitude }}° E</p>
                </div>
              </div>
              <button 
                class="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                (click)="searchOnDuckDuckGo(destination.Destination)"
              >
                Search on DDG
              </button>
              <button class="bg-green-500 text-white p-2 rounded mt-2 hover:bg-green-600 transition-colors duration-300 ease-in-out"
                (click)="selectDestination(destination)">
                Select
              </button>
            </div>
          </div>
        </ng-container>
      </div>

      <!-- No Results Message -->
      <div 
        *ngIf="destinations.length === 0 && !isLoading" 
        class="text-center text-white mt-4"
      >
        No destinations found matching your search criteria.
      </div>

      <!-- Loading Indicator -->
      <div 
        *ngIf="isLoading" 
        class="text-center text-white mt-4"
      >
        Searching destinations...
      </div>
    </div>
  `,
  styles: [`
    .truncate {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `],
  imports: [FormsModule, NgIf, NgFor, MapComponent]
})
export class SearchComponent implements OnInit {
  // send the selected destination to the list-create component
  @Output() destinationSelected = new EventEmitter<Destination>();

  selectDestination(destination: Destination) {
    this.destinationSelected.emit(destination);
  }
  
  // Search input fields
  searchName: string = '';
  searchRegion: string = '';
  searchCountry: string = '';
  resultLimit: number = 5;
  map!: L.Map; // Leaflet map
  markers: L.Marker[] = []; 

  // Destinations array with expanded state
  destinations: (Destination & { expanded?: boolean })[] = [];

  isLoading: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {}

  getMapDestinations(): MapDestination[] {
    return this.destinations
      .filter(dest => dest.Latitude !== undefined && dest.Longitude !== undefined)
      .map(dest => ({
        id: dest.id,
        Destination: encodeURI(dest.Destination),
        Region: encodeURI(dest.Region),
        Country: encodeURI(dest.Country),
        Latitude: dest.Latitude!,  // Non-null assertion after filter
        Longitude: dest.Longitude!
      }));
    }

  // implementing search method in supabase service
  async searchDestinations() {
    this.destinations = [];
    this.isLoading = true;

    try {
      const { data, error } = await this.supabaseService.searchDestinations(
        this.searchName,
        this.searchRegion,
        this.searchCountry,
        this.resultLimit
      );

      if (error) {
        console.error('Error searching destinations:', error);
      } else {
        try {
          const destinations = data ?? [];

          // Update the destinations in service
          this.destinationService.updateDestinations(destinations);
          
          // Add expanded state to destinations
          this.destinations = (data || []).map(dest => ({
            ...dest,
            expanded: false
          }));
          console.log('successful query');
        } catch {
          console.log('error after query', error);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  toggleDestinationDetails(destination: Destination & { expanded?: boolean }) {
    destination.expanded = !destination.expanded;
  }

  // can't just manipulate the DOM, not what Angular is about, have to do it like this
  clearResults() {
    // Clear the destinations array
    this.destinations = [];
    // Reset the search fields (optional, depending on your intended behavior)
    this.searchName = '';
    this.searchRegion = '';
    this.searchCountry = '';
  }

  searchOnDuckDuckGo(destinationName: string): void {
    if (destinationName) {
      const query = encodeURIComponent(destinationName);
      const url = `https://duckduckgo.com/?q=${query}`;
      window.open(url, '_blank');
    } else {
      console.warn('Destination name is empty. Cannot perform search.');
    }
  }
}
