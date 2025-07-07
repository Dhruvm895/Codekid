import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthComponent } from "./auth/auth";
import { Navbar } from "./navbar/navbar";

@Component({
  selector: 'app-root',

  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Navbar, AuthComponent]
})
export class App {
  protected title = 'codekid';
}
