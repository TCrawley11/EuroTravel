import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DestinationService } from './destination.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

describe('DestinationService', () => {
  let service: DestinationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ Router, HttpClient,
      ],
      providers: [DestinationService]
    });
    
    TestBed.runInInjectionContext(() => {
      service = TestBed.inject(DestinationService);
    })
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});