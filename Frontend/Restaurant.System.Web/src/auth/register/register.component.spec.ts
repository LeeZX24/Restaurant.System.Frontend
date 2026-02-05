import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { APP_CONFIG } from '../../app/shared/configs/app-config.state';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockAppConfig = {
    apiUrl: 'http://localhost:3000',
    // ... add other properties your config requires
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        {
          provide: APP_CONFIG,
          useValue: mockAppConfig
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
