import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Space, SPACES } from '../../shared/constants/space.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  standalone:true,
  imports: [RouterModule, CommonModule, FormsModule]
})
export class RoomDetailComponent implements OnInit {
  space: Space | undefined;
  selectedPlan: string = '';

  // Enquiry form model
  enquiry = {
    name: '',
    email: '',
    phone: '',
    plan: '',
    date: '',
    message: ''
  };
  enquirySubmitted = false;
  enquiryErrors: { [key: string]: string } = {};

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('type');
    this.space = SPACES.find(s => s.type === 'room' && s.slug === slug);

    if (!this.space) {
      this.router.navigate(['/not-found']);
    }
  }

  selectPlan(plan: string, price: number) {
    this.selectedPlan = plan;
    this.enquiry.plan = plan;
    setTimeout(() => {
      const el = document.getElementById('enquiry-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  validateEnquiry(): boolean {
    this.enquiryErrors = {};
    if (!this.enquiry.name.trim()) {
      this.enquiryErrors['name'] = 'Name is required.';
    }
    if (!this.enquiry.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.enquiry.email)) {
      this.enquiryErrors['email'] = 'Valid email is required.';
    }
    if (!this.enquiry.phone.trim() || !/^\+?\d{8,15}$/.test(this.enquiry.phone)) {
      this.enquiryErrors['phone'] = 'Valid phone number is required.';
    }
    if (!this.enquiry.plan) {
      this.enquiryErrors['plan'] = 'Please select a plan.';
    }
    if (!this.enquiry.date) {
      this.enquiryErrors['date'] = 'Please select a preferred date.';
    }
    return Object.keys(this.enquiryErrors).length === 0;
  }

  submitEnquiry() {
    this.enquirySubmitted = true;
    if (!this.validateEnquiry()) {
      return;
    }
    // Here you would send the enquiry to the backend or email service
    // For now, just show the modal
    const modal = document.getElementById('enquiryModal');
    if (modal) {
      modal.style.display = 'block';
    }
    // Optionally reset form
    this.enquiry = { name: '', email: '', phone: '', plan: '', date: '', message: '' };
  }

  closeModal() {
    const modal = document.getElementById('enquiryModal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.enquirySubmitted = false;
  }
}