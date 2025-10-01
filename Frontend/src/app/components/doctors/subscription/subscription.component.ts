import { Component } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {

  constructor(private doctorService: DoctorService,
    private authService: AuthService
  ) { }

  plans = [
    {
      name: 'Starter (3 months)',
      planType: 'free',
      price: 'free',
      features: [
        'Smart Appointment Tracking',
        'Patient & Clinic Data',
        'Advanced Analytics',
        'Multi-device Access',
        'Priority Email Support'
      ]
    },
    {
      name: 'Growth (6 months)',
      planType: '6_months',
      price: '₹699',
      features: [
        'Smart Appointment Tracking',
        'Patient & Clinic Data',
        'Advanced Analytics',
        'Multi-device Access',
        'Priority Email Support'
      ],
      badge: 'Most Popular'
    },
    {
      name: 'Pro (12 months)',
      planType: '12_months',
      price: '₹1199',
      features: [
        'Smart Appointment Tracking',
        'Patient & Clinic Data',
        'Advanced Analytics',
        'Multi-device Access',
        'Priority Email Support'
      ],
      badge: 'Best Value'
    }
  ];


  username: string = '';
  doctorId: string = '';

  ngOnInit() {
    this.username = this.authService.getDoctorName();
    this.doctorId = this.authService.getDoctorId();
    // console.log('Doctor ID:', this.doctorId);
  }

  selectPlan(planType: string) {
    const plan = this.plans.find(p => p.planType === planType);
    if (!plan) {
      alert('Invalid plan selected.');
      return;
    }

    this.doctorService.createSubscription(this.doctorId, planType).subscribe(
      (res: any) => {
        if (plan.price === 'free') {
          // Free plan subscribed
          alert('You have successfully subscribed to the Free Plan!');
        } else {
          // Paid plan: open Razorpay checkout
          this.openRazorpayCheckout(res.order, planType);
        }
      },
      (err: any) => {
        console.error('Error subscribing to plan:', err);
        alert(err.error?.error || 'Something went wrong');
      }
    );
  }

  openRazorpayCheckout(order: any, planType: string) {
    const options: any = {
      key: 'rzp_test_RLQ6vxJ5liY0P8', // Replace with your Razorpay key
      amount: order.amount,
      currency: order.currency,
      name: 'Clinic Subscription',
      description: `Payment for ${planType} plan`,
      order_id: order.id,
      handler: (response: any) => {
        // Call backend to verify payment
        this.doctorService.verifyPayment(this.doctorId, planType, response.razorpay_payment_id)
          .subscribe(
            (res: any) => {
              alert('Payment successful! Plan activated.');
            },
            (err: any) => {
              console.error('Payment verification failed:', err);
              alert('Payment verification failed.');
            }
          );
      },
      prefill: {
        name: this.username,
        email: '',  // optionally get email from authService
        contact: '' // optionally get contact from authService
      },
      theme: { color: '#3399cc' }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

}
