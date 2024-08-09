import { Component, OnInit } from '@angular/core';
import { Logger } from '../../logging/logger.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit {
  readonly #logger = new Logger('callback.component');
  ngOnInit(): void {
    this.#logger.debug('ngOnInit');
  }
}
