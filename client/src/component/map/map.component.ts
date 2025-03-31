import { Component, AfterViewInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import * as L from 'leaflet';
import { Icon } from 'leaflet';

interface Destination {
  Destination: string;
  Country: string;
  Region: string;
  Latitude: number;
  Longitude: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <div class="w-full">
      <div id="destination-map" class="w-full h-96 rounded-lg shadow-md"></div>
      
      <div *ngIf="destinations.length > 0" class="flex flex-wrap justify-center gap-2 mt-4">
        <button 
          *ngFor="let destination of destinations; let i = index"
          (click)="focusOnDestination(destination)"
          class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          {{ destination.Destination }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() destinations: Destination[] = [];
  
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  // angular subscribe to change but older ng version
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['destinations'] && !changes['destinations'].firstChange) {
      this.updateMapMarkers();
    }
  }

  private initializeMap(): void {
    // Initialize map with a global view
    this.map = L.map('destination-map', {
      center: [20, 0],  // Centered on the globe
      zoom: 2,
      worldCopyJump: true  // Allow infinite horizontal panning
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Update markers if destinations are already loaded
    if (this.destinations.length > 0) {
      this.updateMapMarkers();
    }
  }

  private updateMapMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add new markers
    const validDestinations = this.destinations.filter(
      dest => dest.Latitude !== undefined && dest.Longitude !== undefined
    );

    if (validDestinations.length === 0) return;

    // Create markers for each destination
    validDestinations.forEach(destination => {
      if (destination.Latitude && destination.Longitude && this.map) {
        const marker = L.marker([destination.Latitude, destination.Longitude], {
          icon: L.icon({
            ...Icon.Default.prototype.options,
            iconUrl: 'assets/marker-icon.png',
            iconRetinaUrl: 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png'
           })
        })
          .addTo(this.map)
          .bindPopup(`
            <b>${destination.Destination}</b><br>
            ${destination.Country}, ${destination.Region}
          `);
        
        this.markers.push(marker);
      }
    });

    // Fit map to markers
    if (this.map && this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), {
        padding: [50, 50],
        maxZoom: 6
      });
    }
  }

  focusOnDestination(destination: Destination): void {
    if (this.map && destination.Latitude && destination.Longitude) {
      this.map.setView(
        [destination.Latitude, destination.Longitude], 
        8  // Zoom level when focusing on a specific destination
      );
    }
  }
}