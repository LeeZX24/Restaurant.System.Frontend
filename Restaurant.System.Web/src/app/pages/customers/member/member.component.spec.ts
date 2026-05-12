import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Member } from './member.component';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Member', () => {
  let component: Member;
  let fixture: ComponentFixture<Member>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Member],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Member);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
