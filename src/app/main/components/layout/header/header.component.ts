import {Component, Input, OnInit} from '@angular/core';
import {ProductsService} from "../../../services/products.service";
import {Product} from "../../../models/product";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  @Input() productAddedToCart: boolean = false;
  isCardOpen: boolean = false;
  productsInCart: Array<Product> = [];


  ngOnInit() {
    this.getFromCart();
  }

  constructor(private productService: ProductsService) {
  }

  openCart() {
    this.isCardOpen = !this.isCardOpen
    this.productAddedToCart = false;
  }

  closeCart() {
    this.isCardOpen = false;
  }

  getFromCart() {
    let cart = [];
    const cartFromStorage = localStorage.getItem("cart");
    if(cartFromStorage) {
      try {
        cart = JSON.parse(cartFromStorage);
      }
      catch {}
    }

    cart.forEach((cartItem: any) => {
      this.productService.getProduct(cartItem.id).subscribe(res => {
        this.productsInCart.push(res);
      });
    });
  }

  removeFromCart(productId: number) {
    const cartFromStorage = localStorage.getItem("cart");

    if(cartFromStorage) {
      try {
        let cart = JSON.parse(cartFromStorage);
        cart = cart.filter((cartItem: any) => cartItem.id !== productId);

        localStorage.setItem("cart", JSON.stringify(cart));

        this.productsInCart = this.productsInCart.filter((product: any) => product.id !== productId);

        console.log("Product removed from the cart");
      } catch(e) {
        console.error("Error parsing cart from localStorage", e);
      }
    }
  }

}
