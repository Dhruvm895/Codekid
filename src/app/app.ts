import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthComponent } from "./auth/auth";
import { Navbar } from "./navbar/navbar";

@Component({
  selector: 'app-root',

  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [Navbar,  RouterOutlet]
})
export class App {
  protected title = 'codekid';
}
