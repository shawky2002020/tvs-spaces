import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-required',
  template: `
    <div class="payment-required">
      <h2>🚫 Access Suspended!</h2>
      <p>
        This site is currently <strong>working from home</strong><br/>
        <em>due to business needs and engineer policies™</em> <br/>
        Translation in plain English: <strong>NO 💸 = NO WEBSITE </strong><br/>

      </p>
    </div>
  `,
  styles: [`
    .payment-required {
      max-width: 500px;
      margin: 5rem auto;
      padding: 2.5rem;
      background: #fff0f0;
      border-radius: 1.25rem;
      text-align: center;
      color: #b71c1c;
      font-family: "Segoe UI", sans-serif;
      font-size: 1.15rem;
      line-height: 1.7;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      animation: shake 0.6s ease-in-out;
    }
    .payment-required h2 {
      font-size: 1.9rem;
      margin-bottom: 1rem;
    }
    em {
      display: inline-block;
      margin-top: 0.5rem;
      font-size: 0.95rem;
      color: #757575;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-5px); }
      40% { transform: translateX(5px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
  `]
})
export class PaymentRequiredComponent {}

