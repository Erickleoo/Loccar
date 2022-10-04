import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-carros',
  templateUrl: './carros.component.html',
  styleUrls: ['./carros.component.css'],
})
export class CarrosComponent implements OnInit {
  toppings = new FormControl('');

  toppingList: string[] = ['Popular', 'Sedan', 'Luxo'];
  constructor() {}

  ngOnInit(): void {}
}
