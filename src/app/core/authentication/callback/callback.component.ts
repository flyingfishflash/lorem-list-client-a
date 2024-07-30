import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit {
  private readonly router = inject(Router)

  ngOnInit(): void {
    console.log('callback component: init')
    this.router.navigateByUrl('/home')
  }
}
