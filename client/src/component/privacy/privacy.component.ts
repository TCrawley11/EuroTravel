import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  imports: [],
  template: `
  <div class="policy-container">
  <h1 class="policy-title">Privacy and Security Policy</h1>
  <p>Your privacy and security are important to us. Here, we outline the ways in which we collect, store, and use your data...</p>

  <h1 class="policy-title">DMCA Notice and Takedown Policy</h1>
  <p>If you believe your work has been infringed upon, you can contact us at:</p>
  <p>Email: <a href="mailto:contact@yourdomain.com">tcrawley&#64;uwo.ca</a></p>
  <p>Provide us with the details of the infringement...</p>

  <h1 class="policy-title">Acceptable Use Policy</h1>
  <p>By using this website, you agree to abide by the following rules...</p>
</div>
  `,
  styles: `
  body {
  font-family: Arial, sans-serif;
  background-color: #1e1e1e; /* Dark background for contrast */
  color: white; /* White text */
  margin: 0;
  padding: 0;
}

.policy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
  background-color: #333; /* Slightly lighter background for content area */
  border-radius: 10px;
}

.policy-title {
  font-size: 2rem;
  margin-bottom: 15px;
  text-transform: uppercase;
  color: #ffcc00; /* Highlighting titles with gold color */
}

a {
  color: #ffcc00; /* Gold color for links */
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

h1, p {
  margin: 0 0 20px;
}`
})
export class PrivacyComponent {

}
