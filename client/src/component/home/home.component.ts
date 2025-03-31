import { Component } from '@angular/core';
import { SearchComponent } from "../search/search.component";
import { AboutComponent } from "../about/about.component";

@Component({
  selector: 'app-home',
  imports: [SearchComponent,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
