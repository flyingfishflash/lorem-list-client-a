import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit {
  ngOnInit(): void {
    console.log('callback component: init')
  }
}
