import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { Hero } from './sections/hero/hero';
import { TrustBand } from './sections/trust-band/trust-band';
import { Products } from './sections/products/products';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, TrustBand, Products, About, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
